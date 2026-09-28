import { Breadcrumbs, Cta, PageHero } from '@/components/site'

export const metadata = {
  title: 'What You Need to Know About Electrical Generator Installation',
  description: 'A practical Calgary guide to generator electrical installation, load planning, transfer equipment and safe connection considerations.',
  alternates: { canonical: '/what-you-need-to-know-about-electrical-generator-installation/' },
}

export default function GeneratorInstallationGuide() {
  return <>
    <Breadcrumbs items={[{ label: 'Generator installation guide' }]} />
    <PageHero eyebrow="Electrical planning" title="What you need to know about electrical generator installation">
      Generator projects start with the loads you need to support, the generator type and a safe method of connecting backup power to the building electrical system.
    </PageHero>
    <section className="section wrap prose narrow">
      <h2>Plan the electrical side before choosing equipment</h2>
      <p>A generator should be sized around the circuits and equipment that actually need backup power. A homeowner may only need essential loads such as refrigeration, heating controls, lighting and communications, while a commercial property may have operational equipment that changes the calculation substantially.</p>
      <h2>Transfer equipment matters</h2>
      <p>Backup power must be connected so the normal utility supply and generator supply are controlled safely. The transfer arrangement depends on the generator, building service and intended operating method. This is not a place for improvised backfeeding or temporary wiring.</p>
      <h2>Consider starting loads and future demand</h2>
      <p>Motors, pumps, compressors and other equipment can draw considerably more current while starting than during normal operation. Those loads, along with future electrical additions, should be considered before finalizing generator capacity and distribution changes.</p>
      <h2>Installation is more than the generator itself</h2>
      <p>Generator projects can involve service equipment, breakers, transfer switches, feeder wiring, grounding and coordination with fuel or mechanical trades. The electrical scope should be evaluated against the existing system and the equipment manufacturer requirements.</p>
      <p>Platinum Electrical Services can review the electrical portion of a generator project in Calgary and help determine the practical next steps for the property.</p>
    </section>
    <Cta />
  </>
}
