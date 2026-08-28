import 'server-only'

const SITE_PLAN_PATH = '/api/v1/site-plan'

export const trustedSitePlanRequest = Object.freeze({
  site: 'pes',
  domain: 'pt-electrical.com',
  framework: 'nextjs',
  industry: 'electrical',
  location: Object.freeze({ city: 'Calgary', region: 'AB' }),
})

function failure(code, message, httpStatus = null) {
  return { ok: false, status: code, httpStatus, sitePlan: null, error: message }
}

/**
 * Fetches capability and architecture data from Trusted Engine on the server.
 * This function always resolves to a diagnostic result so the PES presentation
 * layer can fall back to its static behavior when Trusted is unavailable.
 */
export async function getTrustedSitePlan() {
  const baseUrl = process.env.TRUSTED_ENGINE_URL?.trim()
  const apiKey = process.env.TRUSTED_ENGINE_API_KEY?.trim()

  if (!baseUrl || !apiKey) {
    return failure('not_configured', 'Trusted Engine server environment variables are not configured.')
  }

  let endpoint
  try {
    endpoint = new URL(SITE_PLAN_PATH, `${baseUrl.replace(/\/$/, '')}/`)
  } catch {
    return failure('invalid_configuration', 'TRUSTED_ENGINE_URL is not a valid absolute URL.')
  }

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${apiKey}`,
        'content-type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify(trustedSitePlanRequest),
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    })

    if (!response.ok) {
      const code = response.status === 401 || response.status === 403 ? 'unauthorized' : 'upstream_error'
      return failure(code, `Trusted Engine returned HTTP ${response.status}.`, response.status)
    }

    const sitePlan = await response.json()
    if (!sitePlan?.site?.id || typeof sitePlan.features !== 'object') {
      return failure('invalid_response', 'Trusted Engine returned an invalid site-plan response.', response.status)
    }

    return { ok: true, status: 'connected', httpStatus: response.status, sitePlan, error: null }
  } catch (error) {
    const timedOut = error?.name === 'TimeoutError' || error?.name === 'AbortError'
    return failure(timedOut ? 'timeout' : 'unavailable', timedOut ? 'Trusted Engine timed out.' : 'Trusted Engine is unavailable.')
  }
}
