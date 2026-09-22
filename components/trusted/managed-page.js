import Link from 'next/link'
import { PageHero } from '@/components/site'

function asText(value, fallback = '') {
  return typeof value === 'string' ? value : fallback
}

function safeHref(value, fallback = '/contact/') {
  if (typeof value !== 'string') return fallback
  if (value.startsWith('/') || value.startsWith('https://') || value.startsWith('http://')) return value
  return fallback
}

export function TrustedSection({ section }) {
  if (!section || typeof section !== 'object') return null
  const props = section.props && typeof section.props === 'object' ? section.props : {}

  switch (section.type) {
    case 'hero':
      return <PageHero eyebrow={asText(props.eyebrow, 'Platinum Electrical Services')} title={asText(props.heading, 'Electrical services in Calgary')}>{asText(props.body)}</PageHero>

    case 'content':
      return <section className="section wrap content-grid"><div><p className="eyebrow dark">{asText(props.eyebrow)}</p><h2>{asText(props.heading)}</h2>{Array.isArray(props.paragraphs) ? props.paragraphs.filter(p => typeof p === 'string').map((p, i) => <p key={i}>{p}</p>) : props.body ? <p>{asText(props.body)}</p> : null}</div></section>

    case 'links': {
      const links = Array.isArray(props.links) ? props.links : []
      return <section className="section wrap"><div className="link-panel"><h2>{asText(props.heading, 'Related services')}</h2>{links.map((item, index) => {
        if (!item || typeof item !== 'object') return null
        return <Link key={`${safeHref(item.href)}-${index}`} href={safeHref(item.href)}>{asText(item.label, 'Learn more')}<span>→</span></Link>
      })}</div></section>
    }

    case 'cta':
      return <section className="cta"><div className="wrap"><div><p className="eyebrow">{asText(props.eyebrow, 'Talk with our team')}</p><h2>{asText(props.heading, 'Have an electrical project or service need?')}</h2><p>{asText(props.body)}</p></div><Link className="button light" href={safeHref(props.buttonHref)}>{asText(props.buttonLabel, 'Contact Platinum Electrical')}</Link></div></section>

    default:
      return null
  }
}

function remoteEntry(section, fallbackIndex) {
  if (!section || typeof section !== 'object') return null
  return {
    id: typeof section.id === 'string' && section.id ? section.id : `trusted-${fallbackIndex}`,
    node: <TrustedSection section={section} />,
  }
}

export function applyTrustedOperations(localSections, operations) {
  const sections = [...localSections]

  for (const [operationIndex, operation] of (Array.isArray(operations) ? operations : []).entries()) {
    if (!operation || typeof operation !== 'object') continue
    const targetIndex = sections.findIndex(section => section.id === operation.target)
    if (targetIndex < 0) continue

    if (operation.action === 'remove') {
      sections.splice(targetIndex, 1)
      continue
    }

    const entry = remoteEntry(operation.section, operationIndex)
    if (!entry) continue

    if (operation.action === 'replace') sections.splice(targetIndex, 1, entry)
    if (operation.action === 'insertBefore') sections.splice(targetIndex, 0, entry)
    if (operation.action === 'insertAfter') sections.splice(targetIndex + 1, 0, entry)
  }

  return sections
}

export function TrustedManagedPage({ localSections = [], override }) {
  if (!override?.active || override.mode === 'none') {
    return <>{localSections.map(section => <div key={section.id} style={{ display: 'contents' }}>{section.node}</div>)}</>
  }

  if (override.mode === 'partial') {
    const sections = applyTrustedOperations(localSections, override.operations)
    return <>{sections.map(section => <div key={section.id} style={{ display: 'contents' }}>{section.node}</div>)}</>
  }

  if (override.mode === 'replace' || override.mode === 'create') {
    const sections = Array.isArray(override.page?.sections) ? override.page.sections : []
    return <>{sections.map((section, index) => <TrustedSection key={section?.id ?? `trusted-${index}`} section={section} />)}</>
  }

  return <>{localSections.map(section => <div key={section.id} style={{ display: 'contents' }}>{section.node}</div>)}</>
}

export function trustedMetadata(localMetadata, override) {
  if (!override?.active || (override.mode !== 'replace' && override.mode !== 'create' && override.mode !== 'partial')) return localMetadata
  const seo = override.page?.seo ?? override.seo
  if (!seo || typeof seo !== 'object') return localMetadata

  return {
    ...localMetadata,
    ...(typeof seo.title === 'string' ? { title: seo.title } : {}),
    ...(typeof seo.description === 'string' ? { description: seo.description } : {}),
    ...(typeof seo.canonical === 'string' ? { alternates: { ...(localMetadata?.alternates ?? {}), canonical: seo.canonical } } : {}),
    ...(seo.robots && typeof seo.robots === 'object' ? { robots: seo.robots } : {}),
  }
}
