import Link from 'next/link'
import { Breadcrumbs, Cta } from '@/components/site'

function text(value, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function internalHref(value, fallback = '/') {
  return typeof value === 'string' && value.startsWith('/') ? value : fallback
}

function imageUrl(value) {
  if (typeof value !== 'string') return null
  const trimmed = value.trim()
  return trimmed.startsWith('https://') || trimmed.startsWith('http://') || trimmed.startsWith('/') ? trimmed : null
}

function absoluteUrl(domain, href) {
  const host = text(domain).replace(/^https?:\/\//, '').replace(/\/$/, '')
  if (!host) return internalHref(href, '/')
  return `https://${host}${internalHref(href, '/')}`
}

function serviceAreaSchema(page, area) {
  const siteName = text(page?.site?.name, 'Service provider')
  const domain = text(page?.site?.domain)
  const areaUrl = absoluteUrl(domain, `/service-areas/${area.slug}/`)
  const placeName = area.scope === 'city' || area.name === area.city ? area.name : `${area.name}, ${area.city}`
  const geo = typeof area.lat === 'number' && typeof area.lng === 'number'
    ? { '@type': 'GeoCoordinates', latitude: Number(area.lat.toFixed(3)), longitude: Number(area.lng.toFixed(3)) }
    : undefined

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${absoluteUrl(domain, '/')}#organization`,
        name: siteName,
        url: absoluteUrl(domain, '/'),
      },
      {
        '@type': 'WebPage',
        '@id': `${areaUrl}#webpage`,
        url: areaUrl,
        name: `${placeName} Service Area`,
        description: `${siteName} documented project activity in ${placeName}.`,
        about: {
          '@type': 'Place',
          name: placeName,
          geo,
        },
      },
      {
        '@type': 'Place',
        '@id': `${areaUrl}#place`,
        name: placeName,
        address: {
          '@type': 'PostalAddress',
          addressLocality: area.city || undefined,
          addressRegion: area.province || undefined,
          addressCountry: 'CA',
        },
        geo,
      },
    ],
  }
}

function ProjectCard({ project }) {
  const src = imageUrl(project?.image?.url)
  return <article className="project-index-card">{src ? <Link href={internalHref(project.href, `/projects/${project.slug}/`)} className="project-index-image"><img src={src} alt={text(project?.image?.altText, project.title)} loading="lazy" /></Link> : null}<div className="project-index-content"><p className="eyebrow dark">{text(project.serviceLabel, text(project.serviceKey, 'Electrical project').replace(/-/g, ' '))}</p><h3><Link href={internalHref(project.href, `/projects/${project.slug}/`)}>{text(project.title, 'Completed project')}</Link></h3>{project.summary ? <p>{project.summary}</p> : null}<Link className="text-link" href={internalHref(project.href, `/projects/${project.slug}/`)}>Explore project details →</Link></div></article>
}

export function TrustedServiceAreaPage({ page }) {
  const area = page?.area
  if (!area || typeof area !== 'object') return null
  const placeName = area.scope === 'city' || area.name === area.city ? area.name : `${area.name}, ${area.city}`
  const projects = Array.isArray(area.projects) ? area.projects : []
  const services = Array.isArray(area.serviceLabels) ? area.serviceLabels.filter(item => typeof item === 'string') : []
  const schema = serviceAreaSchema(page, area)
  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: absoluteUrl(page?.site?.domain, '/') },
      { '@type': 'ListItem', position: 2, name: 'Service Areas', item: absoluteUrl(page?.site?.domain, '/service-areas/') },
      { '@type': 'ListItem', position: 3, name: placeName, item: absoluteUrl(page?.site?.domain, `/service-areas/${area.slug}/`) },
    ],
  }

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /><Breadcrumbs items={[{ label: 'Service Areas', href: '/service-areas/' }, { label: placeName }]} /><section className="page-hero"><div className="wrap"><p className="eyebrow">Service Area</p><h1>{placeName}</h1><p>{text(page?.site?.name, 'Our team')} has documented {area.projectCount} completed projects in this area. The work below is drawn from actual tenant project records, not generic location copy.</p></div></section><section className="section"><div className="wrap"><div className="service-area-summary"><div><p className="eyebrow dark">Local project evidence</p><h2>Electrical work documented in {placeName}</h2><p>These project records are used by Trusted Engine to connect real completed work with the areas the business actually serves.</p></div><div className="service-area-facts"><div><strong>{area.projectCount}</strong><span>documented projects</span></div><div><strong>{services.length}</strong><span>service types represented</span></div></div></div>{services.length ? <div className="service-area-tags">{services.map(service => <span key={service}>{service}</span>)}</div> : null}</div></section>{projects.length ? <section className="section offwhite"><div className="wrap"><div className="section-heading"><div><p className="eyebrow dark">Projects in this area</p><h2>Completed work in {placeName}</h2></div><Link className="text-link" href="/projects/">View all projects →</Link></div><div className="project-index-grid">{projects.map(project => <ProjectCard key={project.slug} project={project} />)}</div></div></section> : null}<section className="section"><div className="wrap"><div className="link-panel"><h2>Explore more service areas</h2><Link href={internalHref(area.allAreasHref, '/service-areas/')}>View all service areas<span>→</span></Link><Link href="/our-services/">View electrical services<span>→</span></Link></div></div></section><Cta /></>
}

export function TrustedServiceAreaIndexPage({ page }) {
  const items = Array.isArray(page?.items) ? page.items : []
  return <><section className="page-hero"><div className="wrap"><p className="eyebrow">Service Areas</p><h1>{text(page?.title, 'Service Areas')}</h1><p>{text(page?.description, 'Browse areas backed by documented project activity.')}</p></div></section><section className="section"><div className="wrap"><div className="section-heading"><div><p className="eyebrow dark">Where work is documented</p><h2>Project-backed service areas</h2></div></div><div className="service-area-grid">{items.map(area => <article className="service-area-card" key={area.slug}><p className="eyebrow dark">{area.scope === 'city' ? 'City' : 'Neighbourhood'}</p><h3><Link href={internalHref(area.href, `/service-areas/${area.slug}/`)}>{area.scope === 'city' || area.name === area.city ? area.name : `${area.name}, ${area.city}`}</Link></h3><p>{area.projectCount} documented project{area.projectCount === 1 ? '' : 's'}.</p>{Array.isArray(area.serviceLabels) && area.serviceLabels.length ? <p className="service-area-services">{area.serviceLabels.slice(0, 4).join(' · ')}</p> : null}<Link className="text-link" href={internalHref(area.href, `/service-areas/${area.slug}/`)}>Explore area →</Link></article>)}</div></div></section><Cta /></>
}
