import Link from 'next/link'
import { permanentRedirect, redirect } from 'next/navigation'
import { Breadcrumbs, Cta, PageHero } from '@/components/site'
import { TrustedManagedPage, trustedMetadata } from '@/components/trusted/managed-page'
import { getTrustedPageOverride } from '@/lib/trusted-engine'

const localMetadata = {
  title: 'Residential Electrician Calgary',
  description: 'Residential electrical repairs, panel upgrades, lighting, wiring, hot tubs, surge protection and detector services in Calgary.',
  alternates: { canonical: '/residential/' },
}

export async function generateMetadata() {
  const override = await getTrustedPageOverride('/residential/')
  return trustedMetadata(localMetadata, override)
}

const links = [
  ['Electrical panels & subpanels', '/electrician-services/electrical-panels-subpanels/'],
  ['Main service upgrades', '/electrician-services/main-electrical-service-upgrade/'],
  ['Outlets, switches & wiring', '/electrician-services/plugs-switches-wiring/'],
  ['Lighting', '/electrician-services/lighting/'],
  ['Hot tub installations', '/electrician-services/hot-tub-installations/'],
  ['Surge protection', '/electrician-services/surge-protection/'],
  ['Smoke & CO detectors', '/electrician-services/smoke-detector-carbon-monoxide-detector/'],
]

function localSections() {
  return [
    { id: 'breadcrumbs', node: <Breadcrumbs items={[{ label: 'Residential' }]} /> },
    {
      id: 'hero',
      node: <PageHero eyebrow="Residential electrical" title="Electrical solutions for Calgary homes">Repairs, upgrades and installations planned around your home, its electrical system and how you use the space.</PageHero>,
    },
    {
      id: 'residential-content',
      node: <section className="section wrap content-grid">
        <div><h2>Thoughtful work for existing homes and new projects</h2><p>Residential electrical needs range from a troublesome outlet to a significant service upgrade. We focus on understanding the system and the goal before recommending the work.</p><p>Platinum Electrical Services can support troubleshooting, renovations, lighting improvements, new equipment connections and capacity planning.</p></div>
        <aside className="link-panel"><h2>Residential services</h2>{links.map(([label, href]) => <Link key={href} href={href}>{label}<span>→</span></Link>)}</aside>
      </section>,
    },
    { id: 'cta', node: <Cta /> },
  ]
}

export default async function Residential() {
  const override = await getTrustedPageOverride('/residential/')

  if (override.active && override.mode === 'redirect' && override.destination) {
    if (override.permanent) permanentRedirect(override.destination)
    redirect(override.destination)
  }

  return <TrustedManagedPage localSections={localSections()} override={override} />
}
