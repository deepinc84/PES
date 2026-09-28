import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const SIDEBOX_SOURCE = 'https://s3.amazonaws.com/static.sidebox.com/D36C87DD-3630-41D0-83F4-D0F89C32B957'
const PROJECTS_URL = 'https://pt-electrical.com/projects/'

export async function GET() {
  const page = await fetch(PROJECTS_URL, { cache: 'no-store' })
  if (!page.ok) {
    return NextResponse.json({ ok: false, error: `projects-http-${page.status}` }, { status: 502 })
  }

  const html = await page.text()
  const ids = [...new Set([...html.matchAll(/\/project-media\/(\d{6,10})\.jpg/g)].map((match) => match[1]))]

  const results = []
  const concurrency = 12
  for (let i = 0; i < ids.length; i += concurrency) {
    const batch = ids.slice(i, i + concurrency)
    const checked = await Promise.all(batch.map(async (id) => {
      try {
        const response = await fetch(`${SIDEBOX_SOURCE}/${id}.jpg`, {
          headers: { accept: 'image/jpeg,image/*;q=0.8,*/*;q=0.5' },
          cache: 'no-store',
        })
        if (response.body) await response.body.cancel()
        return {
          id,
          status: response.status,
          ok: response.ok,
          contentType: response.headers.get('content-type'),
          contentLength: response.headers.get('content-length'),
        }
      } catch (error) {
        return { id, status: 0, ok: false, error: error?.name || 'fetch-error' }
      }
    }))
    results.push(...checked)
  }

  const failures = results.filter((result) => !result.ok)
  return NextResponse.json({
    ok: failures.length === 0,
    total: ids.length,
    successes: results.length - failures.length,
    failures: failures.length,
    failed: failures,
  }, {
    headers: { 'cache-control': 'private, no-store' },
  })
}
