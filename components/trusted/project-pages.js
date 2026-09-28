import Link from 'next/link'
import { Cta } from '@/components/site'

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

function locationLabel(project) {
  return [project?.location?.neighborhood, project?.location?.city, project?.location?.province]
    .filter(Boolean)
    .join(', ')
}

function serviceLabel(project) {
  return text(project?.serviceLabel, text(project?.serviceKey, 'Project').replace(/-/g, ' '))
}

function projectImages(project) {
  return Array.isArray(project?.assets)
    ? project.assets.filter(asset => asset?.type === 'image' && imageUrl(asset?.url))
    : []
}

const stageOrder = ['before', 'during', 'after', 'general']
const stageLabels = {
  before: 'Before',
  during: 'Installation / Service',
  after: 'After',
  general: 'Project photos',
}

function ProjectHero({ project }) {
  const images = projectImages(project)
  const hero = images[0] ?? null
  return <section className="project-hero"><div className="wrap project-hero-grid"><div><p className="eyebrow">{serviceLabel(project)}</p><h1>{text(project?.title, 'Completed project')}</h1><p className="project-location">{locationLabel(project)}</p><div className="button-row"><Link className="button primary" href={internalHref(project?.serviceHref, '/our-services/')}>Back to service</Link><Link className="button ghost" href={internalHref(project?.allProjectsHref, '/projects/')}>All projects</Link></div></div>{hero ? <figure className="project-hero-media"><img src={imageUrl(hero.url)} alt={text(hero.altText, `${project.title} completed project photo`)} /><figcaption>{text(hero.caption)}</figcaption></figure> : null}</div></section>
}

function ProjectSummary({ project }) {
  const scopeItems = Array.isArray(project?.scopeItems) ? project.scopeItems.filter(item => typeof item === 'string') : []
  return <section className="section"><div className="wrap"><article className="project-summary-card"><h2>Project summary</h2>{project?.summary ? <p>{project.summary}</p> : null}{project?.description && project.description !== project.summary ? <p>{project.description}</p> : null}{scopeItems.length ? <ul>{scopeItems.map((item, index) => <li key={`${item}-${index}`}>{item}</li>)}</ul> : null}<div className="project-summary-actions"><Link className="button dark" href={internalHref(project?.serviceHref, '/our-services/')}>Explore this service</Link><Link className="button dark" href="/projects/">View all projects</Link></div></article></div></section>
}

function ProjectGallery({ project }) {
  const images = projectImages(project)
  if (!images.length) return null
  const grouped = stageOrder.map(stage => ({ stage, label: stageLabels[stage], images: images.filter(image => (image.stage || 'general') === stage) })).filter(group => group.images.length)
  const unknown = images.filter(image => !stageOrder.includes(image.stage || 'general'))
  if (unknown.length) grouped.push({ stage: 'other', label: 'Project details', images: unknown })

  return <>{grouped.map(group => <section className="project-gallery-section" key={group.stage}><div className="wrap"><div className="project-gallery-heading"><p className="eyebrow dark">{group.label}</p><h2>{group.label}</h2></div><div className="project-photo-grid">{group.images.map((image, index) => <figure className="project-photo-card" key={image.id || `${group.stage}-${index}`}><a href={imageUrl(image.url)} target="_blank" rel="noreferrer"><img src={imageUrl(image.url)} alt={text(image.altText, `${group.label}: ${project.title} image ${index + 1}`)} loading="lazy" /></a><figcaption><strong>{text(image.caption, `${group.label} project photo`)}</strong></figcaption></figure>)}</div></div></section>)}</>
}

function ProjectFaq({ project }) {
  const faqs = Array.isArray(project?.faqs) ? project.faqs.filter(item => item && typeof item.question === 'string' && typeof item.answer === 'string') : []
  if (!faqs.length) return null
  const schema = { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqs.map(item => ({ '@type': 'Question', name: item.question, acceptedAnswer: { '@type': 'Answer', text: item.answer } })) }
  return <section className="section offwhite"><div className="wrap"><article className="project-faq-card"><h2>Questions about this project</h2><div className="project-faq-grid">{faqs.map(item => <div key={item.question}><h3>{item.question}</h3><p>{item.answer}</p></div>)}</div></article></div><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} /></section>
}

export function TrustedProjectPage({ page }) {
  const project = page?.project
  if (!project || typeof project !== 'object') return null
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: '/' },
    { '@type': 'ListItem', position: 2, name: 'Projects', item: '/projects/' },
    { '@type': 'ListItem', position: 3, name: text(project.title, 'Project'), item: internalHref(project.href, '/projects/') },
  ] }

  return <><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} /><ProjectHero project={project} /><ProjectSummary project={project} /><ProjectGallery project={project} /><ProjectFaq project={project} /><Cta /></>
}

function ProjectCard({ project }) {
  const image = projectImages(project)[0] ?? null
  return <article className="project-index-card">{image ? <Link href={internalHref(project.href, `/projects/${project.slug}/`)} className="project-index-image"><img src={imageUrl(image.url)} alt={text(image.altText, project.title)} loading="lazy" /></Link> : null}<div className="project-index-content"><p className="eyebrow dark">{serviceLabel(project)}{project?.location?.neighborhood ? ` · ${project.location.neighborhood}` : ''}</p><h3><Link href={internalHref(project.href, `/projects/${project.slug}/`)}>{text(project.title, 'Completed project')}</Link></h3>{project.summary ? <p>{project.summary}</p> : null}<Link className="text-link" href={internalHref(project.href, `/projects/${project.slug}/`)}>Explore project details →</Link></div></article>
}

export function TrustedProjectIndexPage({ page }) {
  const items = Array.isArray(page?.items) ? page.items : []
  const featured = items.slice(0, 3)
  const remaining = items.slice(3)
  return <><section className="page-hero"><div className="wrap"><p className="eyebrow">Projects</p><h1>{text(page?.title, 'Projects')}</h1><p>{text(page?.description, 'Browse real completed project work.')}</p></div></section>{featured.length ? <section className="section"><div className="wrap"><div className="section-heading"><div><p className="eyebrow dark">Featured projects</p><h2>Recent completed work</h2></div></div><div className="project-index-grid">{featured.map(project => <ProjectCard key={project.slug} project={project} />)}</div></div></section> : null}{remaining.length ? <section className="section offwhite"><div className="wrap"><div className="section-heading"><div><p className="eyebrow dark">Project portfolio</p><h2>More completed projects</h2></div></div><div className="project-index-grid">{remaining.map(project => <ProjectCard key={project.slug} project={project} />)}</div></div></section> : null}<Cta /></>
}
