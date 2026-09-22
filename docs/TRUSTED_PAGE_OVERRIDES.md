# Trusted Engine page overrides (PES)

PES remains the base Next.js website. Trusted Engine is a server-side control layer that can alter selected routes only while the PES API entitlement is active.

## Runtime contract

PES calls `GET {TRUSTED_ENGINE_URL}/api/v1/page-override?path=<route>` using the server-only `TRUSTED_ENGINE_API_KEY` bearer token.

Supported schema: `1.0`.

Supported modes:

- `none`: render the local PES route unchanged.
- `partial`: apply allow-listed insert/replace/remove operations to stable local section IDs.
- `replace`: render a Trusted-supplied declarative section list instead of the local page.
- `create`: render a Trusted-only route through the catch-all route.
- `redirect`: redirect to a Trusted-supplied destination.

No arbitrary JSX, HTML script, or JavaScript is executed from the API.

## Deactivation behaviour

If Trusted Engine is unavailable, credentials are missing/invalid, or the site-override entitlement is disabled:

- existing PES routes render their local repository version;
- Trusted-only routes return 404;
- Trusted sections and Trusted SEO are not persisted locally.

There is deliberately no durable last-good Trusted architecture cache after entitlement loss.

## Initial managed local routes

### `/`

Stable section IDs:

- `hero`
- `core-services`
- `market-capabilities`
- `emergency-service`
- `why-platinum`
- `calgary-local`
- `cta`

### `/residential/`

Stable section IDs:

- `breadcrumbs`
- `hero`
- `residential-content`
- `cta`

Additional local routes can be adapted incrementally without changing their visual design.

## Allow-listed Trusted section types

The first renderer supports:

- `hero`
- `content`
- `links`
- `cta`

Unknown section types render nothing rather than crashing the page. Additional Trusted modules such as geo-post feeds, projects, service areas, quote tools, and activity feeds should be added to the local component registry as those APIs are enabled.

## Partial operation example

```json
{
  "schemaVersion": "1.0",
  "active": true,
  "mode": "partial",
  "route": "/residential",
  "operations": [
    {
      "action": "insertAfter",
      "target": "hero",
      "section": {
        "id": "trusted-residential-proof",
        "type": "content",
        "props": {
          "eyebrow": "Recent Calgary work",
          "heading": "Residential electrical work from the field",
          "body": "This block is controlled by Trusted Engine."
        }
      }
    }
  ]
}
```

## Environment

```text
TRUSTED_ENGINE_URL=https://trusted-engine.vercel.app
TRUSTED_ENGINE_API_KEY=<PES client key>
```

Both values are server-only.
