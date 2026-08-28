import { getTrustedSitePlan } from '@/lib/trusted-engine'

export const metadata = {
  title: 'Trusted Engine Integration Test',
  robots: { index: false, follow: false, nocache: true },
  alternates: { canonical: '/trusted-test/' },
}

export const dynamic = 'force-dynamic'

const featureLabels = {
  projects: 'Projects',
  geoProjects: 'Geo Projects',
  geoPosts: 'Geo Posts',
  serviceAreas: 'Service Areas',
  dynamicSchema: 'Dynamic Schema',
  activityFeed: 'Activity Feed',
  instantQuote: 'Instant Quote',
}

export default async function TrustedTestPage() {
  const trusted = await getTrustedSitePlan()
  const plan = trusted.sitePlan

  return <section className="diagnostic-section">
    <div className="wrap diagnostic-shell">
      <p className="eyebrow dark">Server integration diagnostic</p>
      <div className="diagnostic-heading">
        <div><h1>Trusted Engine</h1><p>This private, noindex page verifies the capability contract without making the public PES website dependent on it.</p></div>
        <span className={`status-badge ${trusted.ok ? 'connected' : 'offline'}`}>{trusted.ok ? 'Connected' : 'Static fallback active'}</span>
      </div>

      {!trusted.ok && <div className="diagnostic-notice" role="status"><strong>Connection status: {trusted.status}</strong><p>{trusted.error} The public Platinum Electrical Services site continues using its local content and routes.</p></div>}

      <dl className="diagnostic-facts">
        <div><dt>Site ID</dt><dd>{plan?.site?.id ?? 'Unavailable'}</dd></div>
        <div><dt>Client name</dt><dd>{plan?.site?.name ?? 'Unavailable'}</dd></div>
        <div><dt>Domain</dt><dd>{plan?.site?.domain ?? 'Unavailable'}</dd></div>
        <div><dt>Account active</dt><dd>{plan ? (plan.site?.active ? 'Yes' : 'No') : 'Unavailable'}</dd></div>
      </dl>

      <section className="diagnostic-panel"><h2>Feature entitlements</h2><ul className="feature-list">{Object.entries(featureLabels).map(([key, label]) => <li key={key}><span>{label}</span><b className={plan?.features?.[key] ? 'enabled' : ''}>{plan ? (plan.features?.[key] ? 'Enabled' : 'Disabled') : 'Unavailable'}</b></li>)}</ul></section>

      <section className="diagnostic-panel"><h2>Recommendations</h2>{plan?.recommendations?.length ? <ul className="recommendation-list">{plan.recommendations.map((recommendation, index) => <li key={recommendation.id ?? index}>{typeof recommendation === 'string' ? recommendation : recommendation.message ?? JSON.stringify(recommendation)}</li>)}</ul> : <p>{trusted.ok ? 'No recommendations returned.' : 'Recommendations are unavailable while disconnected.'}</p>}</section>
    </div>
  </section>
}
