import Link from 'next/link'
import {Breadcrumbs,Cta,PageHero} from '@/components/site'

export const metadata={
  title:'What You Need to Know About Electrical Generator Installation',
  description:'A practical guide to planning a standby or portable generator connection, including load planning, transfer equipment, placement, permits and electrical safety.',
  alternates:{canonical:'/what-you-need-to-know-about-electrical-generator-installation/'},
}

export default function GeneratorInstallationArticle(){return <>
  <Breadcrumbs items={[{label:'Generator installation'}]}/>
  <PageHero eyebrow="Electrical planning" title="What you need to know about electrical generator installation">
    Generator projects are more than choosing a machine by wattage. A safe installation starts with the loads you need to support, the way power will transfer, the available electrical capacity and the requirements of the property.
  </PageHero>
  <article className="section wrap prose narrow">
    <h2>Start with the loads that actually matter</h2>
    <p>Before selecting a generator, identify which circuits must remain available during an outage. A furnace blower, refrigerator, sump pump, lighting, communications equipment and selected receptacles may be more important than trying to power an entire building at once.</p>
    <p>That load list helps determine generator size, transfer equipment and whether the existing electrical service or panel needs changes.</p>

    <h2>Use proper transfer equipment</h2>
    <p>A generator must be isolated from the utility supply when it is feeding a building. Properly selected transfer equipment prevents backfeeding and controls how the generator connects to the electrical system. The right arrangement depends on whether the project uses a permanently installed standby generator or a portable generator connection.</p>

    <h2>Plan placement before installation day</h2>
    <p>Generator location affects cable routing, ventilation, service access, noise, exhaust clearance and the length of the electrical connection. For permanently installed equipment, fuel supply and manufacturer clearances also become part of the planning process.</p>

    <h2>Expect permits and inspection requirements</h2>
    <p>Electrical generator connections should be designed and installed to applicable electrical-code, permit and inspection requirements. The exact scope varies with the equipment and property, so installation details should be confirmed before work begins rather than treated as an afterthought.</p>

    <h2>Think about the electrical system as a whole</h2>
    <p>Older panels, limited service capacity, crowded distribution equipment or existing electrical deficiencies can affect generator work. In some cases the generator project is straightforward; in others it makes sense to address panel or service issues at the same time.</p>
    <p>For related electrical work, see our <Link href="/electrician-services/main-electrical-service-upgrade/">main electrical service upgrade</Link>, <Link href="/electrician-services/electrical-panels-subpanels/">panel and subpanel</Link> and <Link href="/electrician-services/electrical-inspections/">electrical inspection</Link> services.</p>

    <h2>Have the installation evaluated before buying equipment</h2>
    <p>A site review can prevent buying a generator that is undersized, oversized or difficult to integrate with the existing electrical system. The useful questions are simple: what needs power, how long should it run, how will power transfer, where can the equipment go and what electrical work is required to connect it safely?</p>
  </article>
  <Cta/>
</>}
