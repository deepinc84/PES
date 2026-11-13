import { NextResponse } from 'next/server'
import { resolveTrustedEdgeRoute, normalizeTrustedEdgePath } from './lib/trusted-engine-edge'

// Public PES is parked. Create/partial pages resolve inside Next.js; only
// active replace/redirect routes need Edge ownership checks right now.
// Switch PES_ENGINE_FULL_ROUTING=true when Core30 enables dynamic routes.
const PARKED_ENGINE_EDGE_ROUTES = new Set(['/trusted-test'])

export async function middleware(request) {
  if (request.method !== 'GET' && request.method !== 'HEAD') return NextResponse.next()

  const pathname = request.nextUrl.pathname
  if (process.env.PES_ENGINE_FULL_ROUTING !== 'true' &&
      !PARKED_ENGINE_EDGE_ROUTES.has(normalizeTrustedEdgePath(pathname))) {
    return NextResponse.next()
  }
  const decision = await resolveTrustedEdgeRoute(pathname)

  // Fail closed to the native PES application whenever Engine is unavailable,
  // inactive, unconfigured, or has no explicit ownership record for this route.
  if (!decision.active || !decision.found) return NextResponse.next()

  if (decision.mode === 'redirect' && decision.destination) {
    const destination = new URL(decision.destination, request.url)
    return NextResponse.redirect(destination, decision.permanent ? 308 : 307)
  }

  // A create record is intentionally not rewritten here. Existing native Next.js
  // routes therefore keep ownership, while the app-level catch-all can create only
  // routes that Next.js does not already own.
  if (decision.mode !== 'replace') return NextResponse.next()

  const rewriteUrl = request.nextUrl.clone()
  rewriteUrl.pathname = decision.route === '/'
    ? '/trusted-engine-renderer/'
    : `/trusted-engine-renderer${decision.route}`

  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-trusted-engine-rewrite', '1')
  requestHeaders.set('x-trusted-engine-original-path', decision.route)

  return NextResponse.rewrite(rewriteUrl, {
    request: { headers: requestHeaders },
  })
}

export const config = {
  matcher: [
    '/((?!api(?:/|$)|_next(?:/|$)|favicon.ico$|robots.txt$|sitemap.xml$|trusted-engine-renderer(?:/|$)|.*\\.[^/]+$).*)',
  ],
}
