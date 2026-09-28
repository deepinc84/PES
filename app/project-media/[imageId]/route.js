const SIDEBOX_SOURCE = 'https://s3.amazonaws.com/static.sidebox.com/D36C87DD-3630-41D0-83F4-D0F89C32B957'
const MAX_IMAGE_BYTES = 20 * 1024 * 1024

function parseImageId(value) {
  const match = String(value || '').match(/^(\d{6,10})\.jpg$/i)
  return match ? match[1] : null
}

async function fetchProjectImage(imageId) {
  const id = parseImageId(imageId)
  if (!id) return null

  const upstream = await fetch(`${SIDEBOX_SOURCE}/${id}.jpg`, {
    headers: { accept: 'image/jpeg,image/*;q=0.8,*/*;q=0.5' },
    next: { revalidate: 2592000 },
  })

  if (!upstream.ok) return null

  const contentType = upstream.headers.get('content-type') || 'image/jpeg'
  if (!contentType.toLowerCase().startsWith('image/')) return null

  const declaredLength = Number(upstream.headers.get('content-length') || 0)
  if (Number.isFinite(declaredLength) && declaredLength > MAX_IMAGE_BYTES) return null

  return { upstream, contentType }
}

export async function GET(_request, { params }) {
  const resolved = await params
  const result = await fetchProjectImage(resolved?.imageId)

  if (!result) {
    return new Response('Project image not found.', {
      status: 404,
      headers: { 'cache-control': 'public, max-age=300' },
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

  if (!result) {
    return new Response(null, {
      status: 404,
      headers: { 'cache-control': 'public, max-age=300' },
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
