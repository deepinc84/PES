import { NextResponse } from 'next/server'
import { getTrustedSitePlan, getTrustedSitemapState } from '@/lib/trusted-engine'

export const dynamic = 'force-dynamic'

export async function GET() {
  const [result, sitemap] = await Promise.all([
    getTrustedSitePlan(),
    getTrustedSitemapState(),
  ])

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
      sitemap: {
        ok: sitemap.ok,
        active: sitemap.active,
        status: sitemap.status,
        error: sitemap.error,
        entryCount: Array.isArray(sitemap.entries) ? sitemap.entries.length : 0,
        sampleRoutes: Array.isArray(sitemap.entries)
          ? sitemap.entries.slice(0, 10).map((entry) => entry.route)
          : [],
      },
    },
    {
      status: 200,
      headers: { 'cache-control': 'private, no-store' },
    },
  )
}
