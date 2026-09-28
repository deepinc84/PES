const SIDEBOX_SOURCE = 'https://s3.amazonaws.com/static.sidebox.com/D36C87DD-3630-41D0-83F4-D0F89C32B957'
const MAX_IMAGE_BYTES = 20 * 1024 * 1024

function parseImageId(value) {
  const match = String(value || '').match(/^(\d{6,10})\.jpg$/i)
  return match ? match[1] : null
}

async function fetchProjectImage(imageId) {
  const id = parseImageId(imageId)
  if (!id) return { ok: false, reason: 'invalid-id', status: 400 }

  let upstream
  try {
    upstream = await fetch(`${SIDEBOX_SOURCE}/${id}.jpg`, {
      headers: { accept: 'image/jpeg,image/*;q=0.8,*/*;q=0.5' },
      cache: 'no-store',
    })
  } catch {
    return { ok: false, reason: 'upstream-fetch-error', status: 502 }
  }

  const upstreamType = upstream.headers.get('content-type') || ''
  const declaredLength = Number(upstream.headers.get('content-length') || 0)

  if (!upstream.ok) {
    return {
      ok: false,
      reason: 'upstream-http-error',
      status: 404,
      upstreamStatus: upstream.status,
      upstreamType,
      declaredLength,
    }
  }

  if (Number.isFinite(declaredLength) && declaredLength > MAX_IMAGE_BYTES) {
    return {
      ok: false,
      reason: 'upstream-image-too-large',
      status: 413,
      upstreamStatus: upstream.status,
      upstreamType,
      declaredLength,
    }
  }

  // These routes only resolve known .jpg project assets. Some older Sidebox
  // objects have generic S3 MIME metadata, so do not reject a valid 200 solely
  // because Content-Type is application/octet-stream.
  return {
    ok: true,
    upstream,
    contentType: upstreamType.toLowerCase().startsWith('image/') ? upstreamType : 'image/jpeg',
    upstreamStatus: upstream.status,
    upstreamType,
    declaredLength,
  }
}

function diagnosticHeaders(result) {
  return {
    'cache-control': 'public, max-age=300',
    'x-project-image-reason': result.reason || 'unknown',
    'x-project-image-upstream-status': String(result.upstreamStatus || ''),
    'x-project-image-upstream-type': result.upstreamType || '',
    'x-project-image-upstream-length': String(result.declaredLength || ''),
  }
}

export async function GET(_request, { params }) {
  const resolved = await params
  const result = await fetchProjectImage(resolved?.imageId)

  if (!result.ok) {
    return new Response('Project image not found.', {
      status: result.status || 404,
      headers: diagnosticHeaders(result),
    })
  }

  return new Response(result.upstream.body, {
    status: 200,
    headers: {
      'content-type': result.contentType,
      'cache-control': 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800',
      'x-content-type-options': 'nosniff',
    },
  })
}

export async function HEAD(_request, { params }) {
  const resolved = await params
  const result = await fetchProjectImage(resolved?.imageId)

  if (!result.ok) {
    return new Response(null, {
      status: result.status || 404,
      headers: diagnosticHeaders(result),
    })
  }

  return new Response(null, {
    status: 200,
    headers: {
      'content-type': result.contentType,
      'cache-control': 'public, max-age=86400, s-maxage=31536000, stale-while-revalidate=604800',
      'x-content-type-options': 'nosniff',
    },
  })
}
