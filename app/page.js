import Link from 'next/link'
import { permanentRedirect, redirect } from 'next/navigation'
import { Cta, ServiceCard } from '@/components/site'
import { TrustedManagedPage, trustedMetadata } from '@/components/trusted/managed-page'
import { coreServices } from '@/data/site-content'
import { getTrustedPageOverride } from '@/lib/trusted-engine'

const localMetadata = {
  title: 'Calgary Electrician & Electrical Contractor',
  description: 'Platinum Electrical Services provides residential, commercial and industrial electrical services in Calgary, including repairs, upgrades, maintenance and emergency response.',
  alternates: { canonical: '/' },
}

export async function generateMetadata() {
  const override = await getTrustedPageOverride('/')
  return trustedMetadata(localMetadata, override)
}

function localSections() {
  return [
    {
      id: 'hero',
      node: <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">Platinum Electrical Services · Calgary, Alberta</p>
            <h1>Electrical work built around safety, clarity and lasting results.</h1>
            <p className="hero-copy">A Calgary electrical contractor for homes, commercial facilities and industrial operations—from everyday electrical repairs to complex maintenance and equipment work.</p>
            <div className="button-row"><Link className="button primary" href="/contact/">Request service</Link><Link className="button ghost" href="/our-services/">Explore services</Link></div>
          </div>
          <aside className="hero-panel" aria-label="Service overview">
            <span>Electrical support for</span>
            <strong>Residential</strong><strong>Commercial</strong><strong>Industrial</strong>
            <Link href="/electrician-services/24h-emergency-electrical-services/">Need urgent electrical help? →</Link>
          </aside>
        </div>
      </section>,
    },
    {
      id: 'core-services',
      node: <section className="section wrap">
        <div className="section-heading"><div><p className="eyebrow dark">Core services</p><h2>Practical expertise for every kind of property</h2></div><Link className="text-link" href="/our-services/">View all services →</Link></div>
        <div className="card-grid">{coreServices.map(service => <ServiceCard key={service.href} {...service} />)}</div>
      </section>,
    },
    {
      id: 'market-capabilities',
      node: <section className="band"><div className="wrap capability-grid">
        <article><span>01</span><h2>Residential</h2><p>Repairs, panel and service upgrades, lighting, wiring, hot tubs, surge protection and renovation electrical work.</p><Link href="/residential/">Residential services →</Link></article>
        <article><span>02</span><h2>Commercial</h2><p>Dependable installations, lighting, inspections, life-safety systems and planned electrical maintenance.</p><Link href="/our-services/#commercial">Commercial services →</Link></article>
        <article><span>03</span><h2>Industrial</h2><p>Mechanical and electrical maintenance, thermography, CNC support, automation and equipment troubleshooting.</p><Link href="/our-services/#industrial">Industrial services →</Link></article>
      </div></section>,
    },
    {
      id: 'emergency-service',
      node: <section className="section wrap split">
        <div className="emergency-mark" aria-hidden="true">PES<span>RESPONSE</span></div>
        <div><p className="eyebrow dark">Emergency electrical service</p><h2>When an electrical problem cannot wait</h2><p>Unexpected outages, unsafe electrical conditions and urgent equipment problems need a focused response. Our historical emergency service page remains the direct destination for urgent-service information.</p><Link className="button dark" href="/electrician-services/24h-emergency-electrical-services/">Emergency service details</Link></div>
      </section>,
    },
    {
      id: 'why-platinum',
      node: <section className="section offwhite"><div className="wrap why-grid">
        <div><p className="eyebrow dark">Why Platinum</p><h2>Solutions guided by the job—not a one-size-fits-all package</h2></div>
        <div className="checks"><p><b>Clear scope</b><span>We begin by understanding the site, the issue and the outcome you need.</span></p><p><b>Broad capability</b><span>Support across residential, commercial and industrial electrical systems.</span></p><p><b>Safety-minded work</b><span>Thoughtful planning and workmanship are central to every service.</span></p></div>
      </div></section>,
    },
    {
      id: 'calgary-local',
      node: <section className="section wrap calgary"><div><p className="eyebrow dark">Local electrical services</p><h2>Serving Calgary electrical needs</h2><p>Platinum Electrical Services supports property owners, facility teams and businesses across Calgary. Visit our dedicated Calgary electrician page for an overview of local capabilities.</p><Link className="text-link" href="/calgary-electrician/electrician-in-calgary/">Calgary electrician services →</Link></div><div className="line-art" aria-hidden="true"><span>YYC</span></div></section>,
    },
    { id: 'cta', node: <Cta /> },
  ]
}

export default async function Home() {
  const override = await getTrustedPageOverride('/')

  if (override.active && override.mode === 'redirect' && override.destination) {
    if (override.permanent) permanentRedirect(override.destination)
    redirect(override.destination)
  }

  return <TrustedManagedPage localSections={localSections()} override={override} />
}
