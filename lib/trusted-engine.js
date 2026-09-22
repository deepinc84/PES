import 'server-only'

const SITE_PLAN_PATH = '/api/v1/site-plan'
const PAGE_OVERRIDE_PATH = '/api/v1/page-override'
const SUPPORTED_PAGE_SCHEMA_VERSION = '1.0'

export const trustedSitePlanRequest = Object.freeze({
  site: 'pes',
  domain: 'pt-electrical.com',
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

  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        authorization: `Bearer ${config.apiKey}`,
        accept: 'application/json',
        ...(options.headers ?? {}),
      },
      cache: 'no-store',
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
export async function getTrustedSitePlan() {
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

export function normalizeTrustedPath(path) {
  if (!path || path === '/') return '/'
  return `/${String(path).split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '')}`
}

/**
 * Gives Trusted Engine an opportunity to alter one route. Failure or inactive
 * entitlement deliberately returns no override so the local PES site remains intact.
 */
export async function getTrustedPageOverride(path) {
  const route = normalizeTrustedPath(path)
  const result = await trustedFetch(`${PAGE_OVERRIDE_PATH}?path=${encodeURIComponent(route)}`, { method: 'GET' })

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
    destination: typeof data.destination === 'string' ? data.destination : null,
    permanent: data.permanent !== false,
    status: 'connected',
    error: null,
  }
}
