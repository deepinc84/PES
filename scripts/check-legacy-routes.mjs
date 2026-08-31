import { access } from 'node:fs/promises'
import { legacyUrlMap, technicalEndpointExclusions } from '../data/legacy-url-map.js'
import { servicePages } from '../data/site-content.js'

const errors = []
const normalized = path => path === '/' ? '/' : `/${path.split('/').filter(Boolean).join('/').toLowerCase()}/`
const bySource = new Map()
for (const item of legacyUrlMap) {
  if (!['rebuild', 'redirect'].includes(item.action)) errors.push(`${item.source}: invalid action ${item.action}`)
  if (item.source !== normalized(item.source)) errors.push(`${item.source}: source is not normalized`)
  if (bySource.has(item.source)) errors.push(`${item.source}: duplicate source`)
  bySource.set(item.source, item)
}

const rebuilt = new Set(legacyUrlMap.filter(item => item.action === 'rebuild').map(item => item.source))
for (const item of legacyUrlMap.filter(item => item.action === 'redirect')) {
  if (item.source === item.destination) errors.push(`${item.source}: redirects to itself`)
  if (!rebuilt.has(item.destination)) errors.push(`${item.source}: destination is not a rebuilt final URL: ${item.destination}`)
  if (bySource.get(item.destination)?.action === 'redirect') errors.push(`${item.source}: redirect chain through ${item.destination}`)
}

for (const item of legacyUrlMap.filter(item => item.action === 'rebuild')) {
  if (item.source.startsWith('/electrician-services/') && item.source !== '/electrician-services/24h-emergency-electrical-services/') {
    const slug = item.source.split('/')[2]
    if (!servicePages[slug]) errors.push(`${item.source}: no service page content`)
    continue
  }
  const file = item.source === '/' ? 'app/page.js' : `app${item.source}page.js`
  try { await access(new URL(`../${file}`, import.meta.url)) } catch { errors.push(`${item.source}: missing route file ${file}`) }
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exit(1)
}
const counts = legacyUrlMap.reduce((out, item) => ({ ...out, [item.action]: (out[item.action] ?? 0) + 1 }), {})
console.log(`Legacy coverage valid: ${legacyUrlMap.length} content URLs (${counts.rebuild} rebuilt, ${counts.redirect} redirected); ${technicalEndpointExclusions.length} technical endpoints excluded.`)
