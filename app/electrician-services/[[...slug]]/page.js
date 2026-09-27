import { notFound } from 'next/navigation'
import { Breadcrumbs, Cta, PageHero } from '@/components/site'
import { TrustedManagedPage, trustedMetadata } from '@/components/trusted/managed-page'
import { servicePages } from '@/data/site-content'
import { getTrustedPageOverride } from '@/lib/trusted-engine'

export function generateStaticParams() {
  return Object.keys(servicePages).map((slug) => ({ slug: [slug] }))
}

function routeForSlug(slug) {
  return `/electrician-services/${slug}`
}

function nativeWinsCreate(override) {
  if (override?.active && override.mode === 'create') {
    return { ...override, active: false, mode: 'none' }
  }
  return override
}

export async function generateMetadata({ params }) {
  const { slug = [] } = await params
  const data = servicePages[slug[0]]
  if (!data || slug.length !== 1) return {}

  const route = routeForSlug(slug[0])
  const localMetadata = {
    title: data[0],
    description: data[1],
    alternates: { canonical: `${route}/` },
  }

  const override = nativeWinsCreate(await getTrustedPageOverride(route))
  return trustedMetadata(localMetadata, override)
}

export default async function Service({ params }) {
  const { slug = [] } = await params
  if (slug.length !== 1 || !servicePages[slug[0]]) notFound()

  const [title, description, body] = servicePages[slug[0]]
  const route = routeForSlug(slug[0])
  const override = nativeWinsCreate(await getTrustedPageOverride(route))

  const localSections = [
    {
      id: 'breadcrumbs',
      node: <Breadcrumbs items={[{ label: 'Services', href: '/our-services/' }, { label: title }]} />,
    },
    {
      id: 'hero',
      node: <PageHero eyebrow="Electrical service" title={title}>{description}</PageHero>,
    },
    {
      id: 'service-copy',
      node: (
        <section className="section wrap prose narrow">
          <h2>Service built around your requirements</h2>
          <p>{body}</p>
          <p>Contact Platinum Electrical Services with details about your property, equipment and project timing so the work can be evaluated in context.</p>
        </section>
      ),
    },
    {
      id: 'cta',
      node: <Cta />,
    },
  ]

  return <TrustedManagedPage localSections={localSections} override={override} />
}
