import Link from 'next/link'
import { Breadcrumbs, Cta, PageHero } from '@/components/site'

const pageTitle = 'Roofing & Exterior Contractor We Recommend in Calgary | Platinum Electrical Services'
const pageDescription = 'Platinum Electrical Services recommends Trusted Roofing & Exteriors for roofing, siding, eavestrough, soffit and fascia work in the Calgary area.'
const pageUrl = 'https://pt-electrical.com/recommended-contractors/roofing-exteriors/'

export const metadata = {
  title: { absolute: pageTitle },
  description: pageDescription,
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: 'A Calgary roofing and exterior contractor we recommend when a project extends beyond electrical work.',
    url: pageUrl,
    type: 'article',
  },
  twitter: {
    card: 'summary',
    title: pageTitle,
    description: 'A Calgary roofing and exterior contractor we recommend when a project extends beyond electrical work.',
  },
}

export default function RoofingExteriorsRecommendation() {
  return <>
    <Breadcrumbs items={[{ label: 'Roofing & exteriors' }]} />
    <PageHero eyebrow="Recommended local contractor" title="A roofing & exterior contractor we recommend in Calgary">
      Electrical projects sometimes overlap with roofing and exterior work. When the scope moves beyond electrical, we prefer to point customers toward a contractor that works specifically in those systems.
    </PageHero>

    <section className="section wrap prose narrow">
      <h2>When the project goes beyond electrical</h2>
      <p>Platinum Electrical Services focuses on electrical work for homes, commercial properties and industrial facilities. Some projects, however, touch roofing or exterior components at the same time — particularly exterior service work, renovations, penetrations through the building envelope, storm-related repairs and work around soffit or fascia areas.</p>
      <p>For roofing and exterior work in Calgary and the surrounding area, we recommend <a href="https://trustedroofingcalgary.com/">Trusted Roofing &amp; Exteriors</a>. Their services include roofing, roof repair and replacement, siding, eavestrough, soffit and fascia work.</p>

      <h2>Where the trades can overlap</h2>
      <p>Electrical and exterior scopes are normally separate, but coordination can matter when work affects the same part of a property. Common examples include exterior electrical equipment, roof or wall penetrations, service-entry areas, soffit and fascia locations, storm restoration and renovation work involving multiple trades.</p>
      <p>In those situations, the electrical scope remains with Platinum Electrical Services while the roofing or exterior scope should be reviewed by the appropriate exterior contractor. Each trade should confirm its own scope, pricing, scheduling and site requirements.</p>

      <h2>Looking for the right contractor?</h2>
      <p>If the work is electrical, <Link href="/contact/">contact Platinum Electrical Services</Link>. If the project is primarily roofing or exterior work, visit <a href="https://trustedroofingcalgary.com/">Trusted Roofing &amp; Exteriors</a> to review their services and request help directly.</p>
    </section>

    <Cta />
  </>
}
