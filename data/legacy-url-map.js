/**
 * Master inventory of every historical PES content path found in the repository's
 * archive inventory, migration notes, and owner-supplied URL lists.
 *
 * Paths are normalized to lowercase with one trailing slash. Next.js expands
 * redirect entries to accept both slash forms; hostname/protocol variants are
 * handled separately without changing the requested path.
 */
const rebuild = (source, category, reason) => ({ source, action: 'rebuild', destination: source, category, reason })
const redirect = (source, destination, category, reason) => ({ source, action: 'redirect', destination, category, reason })

const protectedPages = [
  rebuild('/', 'protected-historical-page', 'Primary historical website route.'),
  rebuild('/about-us/', 'protected-historical-page', 'Historical company information page retained at its original URL.'),
  rebuild('/our-services/', 'protected-historical-page', 'Historical services hub retained at its original URL.'),
  rebuild('/residential/', 'protected-historical-page', 'Historical residential hub retained at its original URL.'),
  rebuild('/calgary-electrician/electrician-in-calgary/', 'protected-historical-page', 'Historical Calgary electrician landing page retained.'),
  rebuild('/electrician-services/24h-emergency-electrical-services/', 'protected-historical-page', 'Historical emergency service route retained.'),
  rebuild('/contact/', 'protected-historical-page', 'Canonical contact route.'),
]

const rebuiltServiceSlugs = [
  'cnc-installation-sales', 'electrical-inspections', 'electrical-maintenance',
  'electrical-panels-subpanels', 'fire-alarm-life-safety', 'hot-tub-installations',
  'industrial-mechanics', 'ir-thermography-inspections', 'lighting',
  'main-electrical-service-upgrade', 'plugs-switches-wiring',
  'robotic-automation-cnc-programming', 'smoke-detector-carbon-monoxide-detector',
  'surge-protection',
]
const rebuiltServices = rebuiltServiceSlugs.map(slug => rebuild(
  `/electrician-services/${slug}/`, 'historical-service', 'Distinct historical service page rebuilt at its original URL.',
))

const explicitRedirects = [
  redirect('/contact-us/', '/contact/', 'legacy-page', 'Legacy contact page alias.'),
  redirect('/electrician-services/', '/our-services/', 'legacy-service-hub', 'One canonical service hub avoids duplicate indexes.'),
  redirect('/calgary-electrician/electrician-in-calgary-2/', '/calgary-electrician/electrician-in-calgary/', 'legacy-duplicate', 'Numbered duplicate of the canonical Calgary page.'),
  redirect('/calgary-electrician/electrician-near-me-2/', '/calgary-electrician/electrician-in-calgary/', 'legacy-duplicate', 'Old local landing page consolidated into the canonical Calgary page.'),
  redirect('/electrical-panels/100-amp-panel/', '/electrician-services/main-electrical-service-upgrade/', 'old-service-page', 'Old 100 amp panel topic maps to the service-upgrade page.'),
  redirect('/electrical-panels/200-amp-panel/', '/electrician-services/main-electrical-service-upgrade/', 'old-service-page', 'Old 200 amp panel topic maps to the service-upgrade page.'),
  redirect('/electrician-services/chandelier-installation/', '/electrician-services/lighting/', 'service-consolidation', 'Chandelier installation is covered by lighting services.'),
  redirect('/electrician-services/dental-equipment-repair/', '/electrician-services/industrial-mechanics/', 'service-consolidation', 'Specialized equipment repair maps to the closest equipment-support service.'),
  redirect('/electrician-services/energy-efficient-upgrades/', '/electrician-services/lighting/', 'service-consolidation', 'Energy-efficient lighting upgrades are the closest current service.'),
  redirect('/electrician-services/fire-alarm-life-safety-installs/', '/electrician-services/fire-alarm-life-safety/', 'legacy-duplicate', 'Duplicate life-safety service slug.'),
  redirect('/electrician-services/mechanical-electrical-maintenance/', '/electrician-services/industrial-mechanics/', 'service-consolidation', 'Industrial electrical/mechanical maintenance is consolidated.'),
  redirect('/electrician-services/mechanical-maintenance/', '/electrician-services/industrial-mechanics/', 'service-consolidation', 'Mechanical maintenance is consolidated into industrial mechanics.'),
  redirect('/electrician-services/mechanical-repairs/', '/electrician-services/industrial-mechanics/', 'service-consolidation', 'Mechanical repair is consolidated into industrial mechanics.'),
  redirect('/electrician-services/medical-equipment-repair/', '/electrician-services/industrial-mechanics/', 'service-consolidation', 'Specialized equipment repair maps to the closest equipment-support service.'),
  redirect('/electrician-services/thermography/', '/electrician-services/ir-thermography-inspections/', 'legacy-duplicate', 'Duplicate thermography topic.'),
  redirect('/5-signs-you-need-to-call-an-electrician-this-winter/', '/residential/', 'old-blog-article', 'Unrecovered winter safety article maps to residential electrical services.'),
  redirect('/5-ways-to-conserve-electricity-in-the-city-of-calgary-during-winter/', '/electrician-services/lighting/', 'old-blog-article', 'Unrecovered conservation article maps to energy-efficient lighting services.'),
  redirect('/6-important-benefits-electrical-maintenance-does-for-your-business/', '/electrician-services/electrical-maintenance/', 'old-blog-article', 'Unrecovered business maintenance article maps to electrical maintenance.'),
]

const taxonomyRedirects = [
  redirect('/electrical-panels/100-amp-panel/filter-all/', '/electrician-services/main-electrical-service-upgrade/', 'wordpress-generated-alias', 'Filter leakage maps to its legitimate panel topic.'),
  redirect('/electrical-panels/100-amp-panel/healthcareindustry/', '/electrician-services/industrial-mechanics/', 'wordpress-generated-alias', 'Healthcare filter maps to the closest equipment-support capability.'),
  redirect('/electrical-panels/100-amp-panel/maintenancepackages/', '/electrician-services/electrical-maintenance/', 'wordpress-generated-alias', 'Maintenance filter maps to electrical maintenance.'),
  redirect('/electrical-panels/100-amp-panel/24hemergencyelectricalservices/', '/electrician-services/24h-emergency-electrical-services/', 'wordpress-generated-alias', 'Emergency filter maps directly to the emergency service.'),
  redirect('/calgary-electrician/electrician-in-calgary/filter-all/', '/calgary-electrician/electrician-in-calgary/', 'wordpress-generated-alias', 'Filter leakage maps to its legitimate parent page.'),
  redirect('/calgary-electrician/electrician-in-calgary/healthcareindustry/', '/electrician-services/industrial-mechanics/', 'wordpress-generated-alias', 'Healthcare filter maps to the closest equipment-support capability.'),
  redirect('/calgary-electrician/electrician-in-calgary/maintenancepackages/', '/electrician-services/electrical-maintenance/', 'wordpress-generated-alias', 'Maintenance filter maps to electrical maintenance.'),
  redirect('/calgary-electrician/electrician-near-me-2/maintenancepackages/', '/electrician-services/electrical-maintenance/', 'wordpress-generated-alias', 'Maintenance filter maps directly to electrical maintenance.'),
]

// The complete underscore namespace is retained as aliases, but never rendered,
// ensuring it cannot become a separately indexable duplicate.
const serviceOutcomes = [...rebuiltServices, ...explicitRedirects.filter(item => item.source.startsWith('/electrician-services/') && item.source !== '/electrician-services/')]
const underscoreAliases = [
  redirect('/electrician_services/', '/our-services/', 'underscore-alias', 'Legacy underscore service namespace.'),
  ...serviceOutcomes.map(item => redirect(
    item.source.replace('/electrician-services/', '/electrician_services/'),
    item.action === 'rebuild' ? item.destination : item.destination,
    'underscore-alias',
    'Legacy underscore namespace maps directly to the final canonical service URL.',
  )),
]

export const legacyUrlMap = [...protectedPages, ...rebuiltServices, ...explicitRedirects, ...taxonomyRedirects, ...underscoreAliases]

export const technicalEndpointExclusions = [
  { source: '/apple-app-site-association', category: 'technical-endpoint', reason: 'Apple Universal Links endpoint; not historical PES content.' },
  { source: '/.well-known/apple-app-site-association', category: 'technical-endpoint', reason: 'Apple Universal Links endpoint; not historical PES content.' },
]

export const legacyRedirects = legacyUrlMap.filter(item => item.action === 'redirect')

const withoutTrailingSlash = path => path === '/' ? path : path.replace(/\/$/, '')
export const nextRedirects = legacyRedirects.flatMap(({ source, destination }) => {
  const slashless = withoutTrailingSlash(source)
  return [...new Set([slashless, `${slashless}/`])].map(sourceVariant => ({ source: sourceVariant, destination, statusCode: 301 }))
})
