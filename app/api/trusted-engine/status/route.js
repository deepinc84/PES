import { NextResponse } from 'next/server'
import { getTrustedSitePlan } from '@/lib/trusted-engine'

export const dynamic = 'force-dynamic'

export async function GET() {
  const result = await getTrustedSitePlan()

  return NextResponse.json(
    {
      ok: result.ok,
      status: result.status,
      httpStatus: result.httpStatus,
      error: result.error,
      site: result.sitePlan?.site
        ? {
            id: result.sitePlan.site.id,
            name: result.sitePlan.site.name,
            domain: result.sitePlan.site.domain,
            active: result.sitePlan.site.active,
          }
        : null,
      features: result.sitePlan?.features ?? null,
    },
    {
      status: 200,
      headers: { 'cache-control': 'private, no-store' },
    },
  )
}
