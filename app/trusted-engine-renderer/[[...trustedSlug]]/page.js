import { headers } from 'next/headers'
import { notFound } from 'next/navigation'
import { TrustedManagedPage, trustedMetadata } from '@/components/trusted/managed-page'
import { getTrustedPageOverride, normalizeTrustedPath } from '@/lib/trusted-engine'

async function rewrittenRoute() {
  const requestHeaders = await headers()
  if (requestHeaders.get('x-trusted-engine-rewrite') !== '1') return null
  const original = requestHeaders.get('x-trusted-engine-original-path')
  return normalizeTrustedPath(original || '/')
}

export const dynamic = 'force-dynamic'

export async function generateMetadata() {
  const route = await rewrittenRoute()
  if (!route) return { robots: { index: false, follow: false } }

  const override = await getTrustedPageOverride(route)
  if (!override.active || override.mode !== 'replace') {
    return { robots: { index: false, follow: false } }
  }

  return trustedMetadata(
    {
      title: 'Platinum Electrical Services',
      alternates: { canonical: route === '/' ? '/' : `${route}/` },
    },
    override,
  )
}

export default async function TrustedReplaceRenderer() {
  const route = await rewrittenRoute()
  if (!route) notFound()

  const override = await getTrustedPageOverride(route)
  if (!override.active || override.mode !== 'replace') notFound()

  return <TrustedManagedPage localSections={[]} override={override} />
}
