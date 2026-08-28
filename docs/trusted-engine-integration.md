# Trusted Engine ↔ Platinum Electrical Services integration

## Status and boundary

Phase 1 establishes only the PES server-side client and diagnostic presentation. The `trusted_engine` repository is not present in this workspace, so its API route could not be implemented or its roofing modules inspected here. No behavior is claimed for code that was unavailable. The required Trusted Engine endpoint contract below is the implementation specification for that repository.

The architectural boundary is strict:

- **Trusted Engine controls capability and structured data.** It may return account configuration, entitlements, architecture guidance, projects, geo-posts, service areas, local activity, schema data and future lead-service availability.
- **PES controls presentation.** It retains its Next.js application, routes, electrical content, historical migrations, visual components, SEO decisions and PES branding.
- The API returns JSON data only. PES never downloads or executes remote JavaScript, JSX, templates or React components.
- PES never connects to Trusted Engine's database or Supabase project directly.

## 1. Versioned API contract

### Endpoint

`POST /api/v1/site-plan`

### Authentication

`Authorization: Bearer <token>`

Trusted Engine reads the expected server-side token from `TRUSTED_ENGINE_CLIENT_API_KEY`. It must compare credentials without returning the key and should return JSON `401 Unauthorized` for a missing, malformed or incorrect bearer credential. The first development release may use one shared key, but the authentication boundary should later resolve client-specific key hashes to account IDs and account-backed feature entitlements.

### PES request

```json
{
  "site": "pes",
  "domain": "pt-electrical.com",
  "framework": "nextjs",
  "industry": "electrical",
  "location": {
    "city": "Calgary",
    "region": "AB"
  }
}
```

Trusted Engine must reject unsupported or missing identifiers with a JSON `400` response. Phase 1 explicitly supports `site: "pes"` and `domain: "pt-electrical.com"`.

### Successful response

```json
{
  "contractVersion": "1.0",
  "site": {
    "id": "pes",
    "name": "Platinum Electrical Services",
    "domain": "pt-electrical.com",
    "active": true
  },
  "features": {
    "projects": true,
    "geoProjects": true,
    "geoPosts": true,
    "serviceAreas": true,
    "dynamicSchema": true,
    "activityFeed": true,
    "instantQuote": false
  },
  "architecture": {
    "serviceHub": "/our-services/",
    "projectsHub": "/projects/",
    "serviceAreasHub": "/service-areas/"
  },
  "recommendations": []
}
```

Recommended response codes are `200` for a valid site plan, `400` for an invalid request, `401` for a bad bearer token, `404` for an unknown client site, and `500` for an unexpected server error. An inactive account may return `200` with `site.active: false` so the client can distinguish account state from transport failure.

## 2. Environment variables

### PES project

```dotenv
TRUSTED_ENGINE_URL=https://your-trusted-engine-project.vercel.app
TRUSTED_ENGINE_API_KEY=<same development client key>
```

Both are server-only. They must not use a `NEXT_PUBLIC_` prefix and must never be passed to a Client Component. `.env.example` contains names and non-secret placeholders only.

### Trusted Engine project

```dotenv
TRUSTED_ENGINE_CLIENT_API_KEY=<same development client key>
```

Set each value separately for Vercel Development, Preview and Production as appropriate. `TRUSTED_ENGINE_URL` must be the deployed Trusted Engine origin without `/api/v1/site-plan`; PES appends the versioned path.

## 3. Failure behavior

`getTrustedSitePlan()` always resolves to a stable diagnostic result:

```js
{
  ok: false,
  status: 'not_configured' | 'invalid_configuration' | 'unauthorized' |
          'upstream_error' | 'invalid_response' | 'timeout' | 'unavailable',
  httpStatus: null,
  sitePlan: null,
  error: 'Safe non-secret message'
}
```

It uses an eight-second timeout and `cache: "no-store"`. It does not throw routine network/authentication failures into page rendering and never includes response bodies that could leak upstream details. The public homepage and all primary routes do not call Trusted Engine. If Trusted is unavailable or an account is inactive, the local PES website continues rendering its static content and historical routes.

## 4. Current feature entitlements

The diagnostic supports these explicit booleans without enabling public features yet:

| Feature | Phase 1 behavior |
| --- | --- |
| Projects | Display entitlement only |
| Geo Projects | Display entitlement only |
| Geo Posts | Display entitlement only |
| Service Areas | Display entitlement only |
| Dynamic Schema | Display entitlement only |
| Activity Feed | Display entitlement only |
| Instant Quote | Display entitlement only; expected false |

`/trusted-test/` is a dynamic Server Component with `noindex`, `nofollow` and `nocache` metadata. It is deliberately absent from the production navigation.

## 5. Future neutral API module roadmap

The named Trusted Roofing areas could not be inspected without that repository. Based only on the supplied module names, the recommended extraction sequence is:

1. **Projects API (recommended next):** neutral project records, typed project photos, service references, locations with privacy controls, publication state and pagination. PES renders its own ProjectCard and carousel.
2. **Service-area API:** canonical service-area records, coverage relationships and approved internal-link targets. Narratives should be structured content, not remote JSX.
3. **Geo-posts API:** industry-neutral local updates linked to projects, services and service areas; keep publishing state and provenance explicit.
4. **SEO/local activity API:** factual activity events and approved metadata inputs. PES decides page markup and copy placement.
5. **Dynamic schema data API:** return validated factual entities/relationships; PES owns JSON-LD rendering and excludes unverified fields.
6. **Lead/quote API:** a neutral, authenticated server-to-server submission contract. Do not copy roofing-specific question flows.

Before extraction, audit `services`, `projects`, `project_photos`, geo-posts, service areas, seo-engine, activity-feed, `DynamicSchema`, `ServiceGeoPosts`, `ProjectCarousel` and `ProjectCard` inside the actual Trusted repositories. Separate database/domain logic from roofing presentation and terminology.

## 6. PES presentation ownership

An entitlement such as `{ "projects": true }` authorizes a capability; it does not supply a component. PES may request structured project data and render it through PES-owned components, colors, typography, electrical service taxonomy and internal-link strategy. Trusted recommendations are advisory data and cannot create routes, execute code or silently override PES metadata.

## Local testing

1. In Trusted Engine, set `TRUSTED_ENGINE_CLIENT_API_KEY=local-shared-secret` and run its development server on port 3001.
2. In PES, copy `.env.example` to `.env.local`, set `TRUSTED_ENGINE_URL=http://localhost:3001` and use the matching key.
3. Run `npm run dev` in PES and open `http://localhost:3000/trusted-test/`.
4. Verify the connected site and entitlement values.
5. Change the PES key and verify a safe `unauthorized` state.
6. Stop Trusted Engine and verify an `unavailable` or `timeout` state while `/`, `/our-services/` and other PES routes continue working.

## Vercel-to-Vercel testing

1. Deploy the Trusted Engine API and set its `TRUSTED_ENGINE_CLIENT_API_KEY` in the target Vercel environment.
2. Set PES `TRUSTED_ENGINE_URL` to that deployment origin and `TRUSTED_ENGINE_API_KEY` to the matching value in the same environment tier.
3. Redeploy both projects because server environment changes require a new deployment.
4. Visit the PES Preview deployment's `/trusted-test/` URL and verify the returned site identity and features.
5. Test a mismatched key, a disabled/inactive account response and a temporarily unavailable Trusted deployment.
6. Confirm `/trusted-test/` emits noindex metadata and is not included in the PES sitemap or navigation.

## Branding blocker

The approved red/black PES logo binaries and vector sources are still absent from this repository and mounted workspace. The integration task does not create or redraw logos. Once the approved files are committed under `public/brand/`, replace the documented fallback with `next/image` and create a Next.js-supported compact icon from the authentic PES mark. Do not derive a favicon from an invented approximation.
