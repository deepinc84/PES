const PAGE_RESOLVE_PATH = '/api/v1/page-resolve'
const SUPPORTED_PAGE_SCHEMA_VERSION = '1.0'

function config() {
  const baseUrl = process.env.TRUSTED_ENGINE_URL?.trim()
  const apiKey = process.env.TRUSTED_ENGINE_API_KEY?.trim()
  const domain = process.env.TRUSTED_ENGINE_SITE_DOMAIN?.trim() || 'pt-electrical.com'
  if (!baseUrl || !apiKey) return null
  return { baseUrl: baseUrl.replace(/\/$/, ''), apiKey, domain }
}

export function normalizeTrustedEdgePath(path) {
  if (!path || path === '/') return '/'
  return `/${String(path).split('?')[0].split('#')[0].replace(/^\/+|\/+$/g, '')}`
}

export async function resolveTrustedEdgeRoute(pathname) {
  const runtime = config()
  const route = normalizeTrustedEdgePath(pathname)
  if (!runtime) return { active: false, found: false, mode: 'none', route, status: 'not_configured' }

  let endpoint
  try {
    endpoint = new URL(`${PAGE_RESOLVE_PATH}?path=${encodeURIComponent(route)}`, `${runtime.baseUrl}/`)
  } catch {
    return { active: false, found: false, mode: 'none', route, status: 'invalid_configuration' }
  }

  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${runtime.apiKey}`,
        'x-trusted-site-domain': runtime.domain,
        accept: 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return { active: false, found: false, mode: 'none', route, status: `http_${response.status}` }
    }

    const payload = await response.json()
    if (!payload || payload.schemaVersion !== SUPPORTED_PAGE_SCHEMA_VERSION || payload.active !== true || payload.found !== true) {
      return { active: payload?.active === true, found: false, mode: 'none', route, status: 'no_override' }
    }

    const record = payload.record && typeof payload.record === 'object' ? payload.record : {}
    const mode = typeof record.mode === 'string' ? record.mode : 'none'
    if (!['replace', 'create', 'redirect'].includes(mode)) {
      return { active: true, found: false, mode: 'none', route, status: 'unsupported_mode' }
    }

    return {
      active: true,
      found: true,
      mode,
      route,
      destination: typeof record.destination === 'string' ? record.destination : null,
      permanent: record.permanent !== false,
      status: 'connected',
    }
  } catch {
    return { active: false, found: false, mode: 'none', route, status: 'unavailable' }
  }
}
