# Trusted Engine service-area navigation

PES receives Engine-managed navigation through `site-plan.navigation`. The local header/footer render those links only while the matching Trusted Engine entitlements are active.

- `projects=true` -> Projects link to `/projects/`
- `serviceAreas=true` -> Service Areas link to `/service-areas/`

This keeps the navigation coupled to live Engine architecture instead of permanently hard-coding links to routes that may disappear when a feature is disabled.
