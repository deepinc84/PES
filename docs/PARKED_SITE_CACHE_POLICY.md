# PES parked-site cache policy

Platinum Electrical Services (`pt-electrical.com`) is a low-change legacy Next.js website. Its public contractor-recommendation page contains a contextual link to Trusted Roofing & Exteriors. The goal is to keep that site indexable while minimizing unnecessary requests to the Trusted Engine / Supabase control plane.

## Default behaviour

- **Public Engine site plan / shared navigation:** cached for **7 days** in the Next.js server Data Cache. The site plan is POST-only, so it is cached through `unstable_cache`. A failed upstream call is **not** cached for 7 days.
- **Public Engine page overrides and sitemap decisions:** Next.js `force-cache` with **7-day revalidation** and a cache tag. Each route has its own cache entry. Cache hits avoid another call to Trusted Engine.
- **Middleware:** `PES_ENGINE_FULL_ROUTING` defaults to `false`. In this parked mode it bypasses the live Engine route-resolution call on normal public URLs. The only currently active replace/redirect route is `/trusted-test`; native pages and partial overrides work through Next.js directly. Engine-created pages use the catch-all and are unaffected.
- **Diagnostics:** `/api/trusted-engine/status` and the native `/trusted-test` use fresh queries. The API status route is private/no-store.
- **Native content:** preserved. `/recommended-contractors/roofing-exteriors/` and its ordinary link to `https://trustedroofingcalgary.com/` are unchanged.

## When Core30 updates PES

1. Change `PES_ENGINE_CACHE_REVISION` in Vercel to a new unique value (e.g., `core30-2027-01-v2`) and redeploy. This gives GET requests a new cache key and refreshes the site-plan cache on first use.
2. If Core30 must dynamically **replace or redirect native PES routes**, set `PES_ENGINE_FULL_ROUTING=true` and redeploy. This restores full per-request route-resolution checks in middleware. Until then, the parked mode intentionally does not react to newly configured native replace/redirect routes.
3. If only public content changes and a delay is acceptable, leave the seven-day cache in place; Next.js revalidates it after expiry on a subsequent request.

**Operational caution:** An active remote page-override / sitemap decision may be visible for up to seven days after a change unless the revision is bumped. To immediately disable or replace published Engine content, bump the revision and redeploy. Do not use this parked policy for admin, user-specific, sensitive or transactional data.

No Supabase tables, key material, DNS records, contact forms or legacy redirects were modified.
