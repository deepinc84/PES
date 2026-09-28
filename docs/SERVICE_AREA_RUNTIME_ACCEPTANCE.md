# Dynamic Service Area Acceptance

Trusted Engine owns `/service-areas/` and `/service-areas/:slug/` when the `serviceAreas` entitlement is enabled.

Acceptance requirements:

- Header/footer links are supplied by Trusted Engine site-plan navigation.
- Service-area pages render tenant-specific project evidence rather than static local copy.
- Individual area pages include project links, service labels, breadcrumb schema, Place/WebPage schema, and privacy-safe public geo coordinates.
- Disabling `serviceAreas` removes both pages and navigation without a PES code change.
