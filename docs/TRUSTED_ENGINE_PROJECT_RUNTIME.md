# Trusted Engine project runtime

PES consumes Trusted Engine project and service-area architecture at request time. The local site keeps its native pages as fallback, while Engine-owned `/projects/*` and `/service-areas/*` routes render only while the corresponding site entitlements are active.

## Runtime responsibilities

- `/projects/` and `/projects/{slug}/` are generated from tenant-scoped Trusted Engine project records rather than one persisted page override per project.
- Project pages use the Trusted Roofing project architecture as the baseline: breadcrumbs, project hero, project summary, staged photo gallery, project-specific FAQ, structured data, related service/project navigation, and CTA.
- Project structured data includes public privacy-safe `GeoCoordinates` when available.
- Header/footer links are supplied by `site-plan.navigation`; Projects and Service Areas therefore appear only while their Engine features are enabled.
- The local PES site does not contain tenant project content or service-area records.

## Fallback contract

If Trusted Engine, the site, its credential, or a feature entitlement is disabled, Engine-only routes stop rendering and the native PES site remains available.
