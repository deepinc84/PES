import { servicePages } from '@/data/site-content'
import { getTrustedSitemapState, normalizeTrustedPath } from '@/lib/trusted-engine'

const base = 'https://pt-electrical.com'

function nativeEntries() {
  const routes = [
    '',
    '/about-us/',
    '/our-services/',
    '/residential/',
    '/contact/',
    '/what-you-need-to-know-about-electrical-generator-installation/',
    '/calgary-electrician/electrician-in-calgary/',
    '/recommended-contractors/roofing-exteriors/',
    '/electrician-services/24h-emergency-electrical-services/',
    ...Object.keys(servicePages).map((slug) => `/electrician-services/${slug}/`),
  ]

  return routes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1 : (route === '/our-services/' ? 0.9 : 0.7),
  }))
}

function routeKey(urlOrPath) {
  try {
    const parsed = /^https?:\/\//i.test(String(urlOrPath))
      ? new URL(String(urlOrPath)).pathname
      : String(urlOrPath)
    return normalizeTrustedPath(parsed)
  } catch {
    return normalizeTrustedPath(urlOrPath)
  }
}

function routeUrl(route) {
  const normalized = normalizeTrustedPath(route)
  return normalized === '/' ? `${base}/` : `${base}${normalized}/`
}

export default async function sitemap() {
  const native = nativeEntries()
  const state = await getTrustedSitemapState()

  // Engine access is deliberately optional. If it cannot be reached or has been
  // disabled centrally, PES returns the exact native sitemap it would have served.
  if (!state.active) return native

  const entries = new Map(native.map((entry) => [routeKey(entry.url), entry]))

  for (const decision of state.entries) {
    if (decision.mode !== 'create' && decision.mode !== 'replace') continue
    const key = routeKey(decision.route)

    if (!decision.indexable) {
      entries.delete(key)
      continue
    }

    const existing = entries.get(key)
    const next = existing
      ? { ...existing }
      : { url: routeUrl(decision.route), changeFrequency: 'monthly', priority: 0.7 }

    if (decision.lastmod) {
      const parsed = new Date(decision.lastmod)
      if (!Number.isNaN(parsed.getTime())) next.lastModified = parsed
    }

    entries.set(key, next)
  }

  return Array.from(entries.values()).sort((a, b) => a.url.localeCompare(b.url))
}
