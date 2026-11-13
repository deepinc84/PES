import 'server-only'
import { unstable_cache } from 'next/cache'

const SITE_PLAN_PATH = '/api/v1/site-plan'
const PAGE_OVERRIDE_PATH = '/api/v1/page-override'
const SITEMAP_PATH = '/api/v1/sites/sitemap'
const SUPPORTED_PAGE_SCHEMA_VERSION = '1.0'

// Public PES content is dormant. Bump PES_ENGINE_CACHE_REVISION and redeploy
// when Core30 introduces new content or a site-plan change must go live now.
export const PES_PUBLIC_CACHE_SECONDS = 7 * 24 * 60 * 60
const PES_CACHE_REVISION = process.env.PES_ENGINE_CACHE_REVISION?.trim() || 'parked-2026-11-13-v1'

export const trustedSitePlanRequest = Object.freeze({
  site: 'pes',
  domain: process.env.TRUSTED_ENGINE_SITE_DOMAIN?.trim() || 'pt-electrical.com',
  framework: 'nextjs',
  industry: 'electrical',
  location: Object.freeze({ city: 'Calgary', region: 'AB' }),
})

function engineConfig() {
  const baseUrl = process.env.TRUSTED_ENGINE_URL?.trim()
  const apiKey = process.env.TRUSTED_ENGINE_API_KEY?.trim()
  if (!baseUrl || !apiKey) return null
  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey }
}

function failure(code, message, httpStatus = null) {
  return { ok: false, status: code, httpStatus, sitePlan: null, error: message }
}

async function trustedFetch(path, options = {}) {
  const { fresh = false, ...fetchOptions } = options
  const method = String(fetchOptions.method || 'GET').toUpperCase()
  const cachePublicGet = method === 'GET' && !fresh
  const config = engineConfig()
  if (!config) {
    return { ok: false, status: 'not_configured', httpStatus: null, data: null, error: 'Trusted Engine server environment variables are not configured.' }
  }

  let endpoint
  try {
    endpoint = new URL(path, `${config.baseUrl}/`)
  } catch {
    return { ok: false, status: 'invalid_configuration', httpStatus: null, data: null, error: 'TRUSTED_ENGINE_URL is not a valid absolute URL.' }
  }

  // Revision distinguishes the seven-day cached GET responses after a new rollout.
  if (cachePublicGet) endpoint.searchParams.set('_pes_cache', PES_CACHE_REVISION)

  try {
    const response = await fetch(endpoint, {
      ...fetchOptions,
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        'x-trusted-site-domain': trustedSitePlanRequest.domain,
        accept: 'application/json',
        ...(fetchOptions.headers ?? {}),
      },
      ...(cachePublicGet
        ? {
            cache: 'force-cache',
            next: {
              revalidate: PES_PUBLIC_CACHE_SECONDS,
              tags: ['pes-public-engine-content'],
            },
          }
        : { cache: 'no-store' }),
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      const code = response.status === 401 || response.status === 403 ? 'unauthorized' : 'upstream_error'
      return { ok: false, status: code, httpStatus: response.status, data: null, error: `Trusted Engine returned HTTP ${response.status}.` }
    }

    return { ok: true, status: 'connected', httpStatus: response.status, data: await response.json(), error: null }
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError'
    return { ok: false, status: timedOut ? 'timeout' : 'unavailable', httpStatus: null, data: null, error: timedOut ? 'Trusted Engine timed out.' : 'Trusted Engine is unavailable.' }
  }
}

/** Fetches the account/capability contract from Trusted Engine. */
async function fetchTrustedSitePlan() {
  const result = await trustedFetch(SITE_PLAN_PATH, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(trustedSitePlanRequest),
  })

  if (!result.ok) return failure(result.status, result.error, result.httpStatus)
  const sitePlan = result.data
  if (!sitePlan?.site?.id || typeof sitePlan.features !== 'object') {
    return failure('invalid_response', 'Trusted Engine returned an invalid site-plan response.', result.httpStatus)
  }

  return { ok: true, status: 'connected', httpStatus: result.httpStatus, sitePlan, error: null }
}

// RootLayout reads the capability contract on every page. Cache this POST
// result for the public site, not for diagnostics.
const getCachedTrustedSitePlan = unstable_cache(
  fetchTrustedSitePlan,
  ['pes-public-site-plan', PES_CACHE_REVISION],
  { revalidate: PES_PUBLIC_CACHE_SECONDS, tags: ['pes-public-site-plan'] },
)

export async function getTrustedSitePlan({ fresh = false } = {}) {
  return fresh ? fetchTrustedSitePlan() : getCachedTrustedSitePlan()
}

export function normalizeTrustedPath(path) {
  if (!path || path === '/') return '/'
  return `/${String(path).split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '')}`
}

/**
 * Gives Trusted Engine an opportunity to alter one route. Failure or inactive
 * entitlement deliberately returns no override so the local PES site remains intact.
 */
export async function getTrustedPageOverride(path, { fresh = false } = {}) {
  const route = normalizeTrustedPath(path)
  const result = await trustedFetch(`${PAGE_OVERRIDE_PATH}?path=${encodeURIComponent(route)}`, { method: 'GET', fresh })

  if (!result.ok) {
    return { ok: false, active: false, mode: 'none', route, status: result.status, error: result.error }
  }

  const data = result.data
  if (!data || data.schemaVersion !== SUPPORTED_PAGE_SCHEMA_VERSION) {
    return { ok: false, active: false, mode: 'none', route, status: 'unsupported_schema', error: 'Trusted Engine returned an unsupported page schema.' }
  }

  const allowedModes = new Set(['none', 'partial', 'replace', 'create', 'redirect'])
  if (!allowedModes.has(data.mode)) {
    return { ok: false, active: false, mode: 'none', route, status: 'invalid_response', error: 'Trusted Engine returned an invalid page mode.' }
  }

  return {
    ok: true,
    active: data.active === true,
    mode: data.active === true ? data.mode : 'none',
    route,
    operations: Array.isArray(data.operations) ? data.operations : [],
    page: data.page && typeof data.page === 'object' ? data.page : null,
    seo: data.seo && typeof data.seo === 'object' ? data.seo : null,
    destination: typeof data.destination === 'string' ? data.destination : null,
    permanent: data.permanent !== false,
    status: 'connected',
    error: null,
  }
}

/**
 * Returns authoritative Engine sitemap decisions. Any failure deliberately
 * reports inactive so PES falls back to its native sitemap unchanged.
 */
export async function getTrustedSitemapState({ fresh = false } = {}) {
  const result = await trustedFetch(SITEMAP_PATH, { method: 'GET', fresh })
  if (!result.ok || !result.data || result.data.active !== true || !Array.isArray(result.data.entries)) {
    return { ok: false, active: false, entries: [], status: result.status, error: result.error }
  }

  return {
    ok: true,
    active: true,
    entries: result.data.entries.map((entry) => ({
      route: normalizeTrustedPath(entry?.route),
      mode: typeof entry?.mode === 'string' ? entry.mode : '',
      indexable: entry?.indexable === true,
      canonical: typeof entry?.canonical === 'string' ? entry.canonical : null,
      robots: entry?.robots ?? null,
      lastmod: typeof entry?.lastmod === 'string' ? entry.lastmod : null,
    })),
    status: 'connected',
    error: null,
  }
}
