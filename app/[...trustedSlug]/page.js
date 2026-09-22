import { notFound, permanentRedirect, redirect } from 'next/navigation'
import { TrustedManagedPage, trustedMetadata } from '@/components/trusted/managed-page'
import { getTrustedPageOverride } from '@/lib/trusted-engine'

function routeFromParams(params) {
  const parts = Array.isArray(params?.trustedSlug) ? params.trustedSlug : []
  return `/${parts.join('/')}`
}

export async function generateMetadata({ params }) {
  const resolved = await params
  const route = routeFromParams(resolved)
  const override = await getTrustedPageOverride(route)

  if (!override.active || (override.mode !== 'create' && override.mode !== 'replace')) {
    return { robots: { index: false, follow: false } }
  }

  return trustedMetadata(
    { title: 'Platinum Electrical Services', alternates: { canonical: `${route}/` } },
    override,
  )
}

export default async function TrustedDynamicPage({ params }) {
  const resolved = await params
  const route = routeFromParams(resolved)
  const override = await getTrustedPageOverride(route)

  if (override.active && override.mode === 'redirect' && override.destination) {
    if (override.permanent) permanentRedirect(override.destination)
    redirect(override.destination)
  }

  if (!override.active || (override.mode !== 'create' && override.mode !== 'replace')) {
    notFound()
  }

  return <TrustedManagedPage localSections={[]} override={override} />
}
