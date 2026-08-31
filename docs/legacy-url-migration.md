# Legacy URL migration audit

## Coverage statement

Every known historical Platinum Electrical Services **content URL available in this checkout and the owner-supplied requirement has been accounted for**. Each normalized content path has exactly one production outcome: a useful page rebuilt at that path or a one-hop HTTP 301 to a final rebuilt page. The executable source of truth is `data/legacy-url-map.js`; `npm run legacy:check` fails on missing route content, duplicate sources, redirect chains, self-redirects, non-final destinations, or invalid outcomes.

## Sources and normalization

The inventory incorporates every unique content URL in `data/archive/pages.json` (the existing Wayback recovery inventory), the existing migration documents, and every Search Console, backlink, article, service, malformed taxonomy, and URL variant identified in the owner-supplied migration requirement. The referenced `seo architecture.xlsx` and raw Search Console/backlink export files are not present anywhere in the repository or mounted workspace, so no unmounted spreadsheet rows can truthfully be claimed as parsed. The repository's recovery script attempted both apex and www Internet Archive scopes; the archive endpoint remains blocked by the environment and its recorded discoveries are included.

Paths are normalized to lowercase and a trailing slash while redirect configuration accepts both trailing-slash forms. The `www` host rules precede the catch-all hostname rule, so known old aliases go straight to the final non-www HTTPS destination. Apex-host path redirects are likewise one hop. HTTP-to-HTTPS is enforced at the deployment edge and preserves the path; there is no homepage collapse.

## Totals

| Measure | Total |
| --- | ---: |
| Historical content URLs discovered/classified | 71 |
| Pages rebuilt | 21 |
| URLs redirected | 50 |
| Underscore aliases | 24 |
| WWW aliases covered | 71 |
| HTTP aliases covered at deployment edge | 71 |
| WordPress-generated aliases | 8 |
| Old blog URLs | 3 |
| Old service URLs (rebuilt, consolidated, or aliased) | 27 |
| Technical endpoints excluded | 2 |

## Rebuilt historical pages

| SOURCE | DESTINATION | CATEGORY | REASON |
| --- | --- | --- | --- |
| `/` | `/` | protected-historical-page | Primary historical website route. |
| `/about-us/` | `/about-us/` | protected-historical-page | Historical company information page retained at its original URL. |
| `/our-services/` | `/our-services/` | protected-historical-page | Historical services hub retained at its original URL. |
| `/residential/` | `/residential/` | protected-historical-page | Historical residential hub retained at its original URL. |
| `/calgary-electrician/electrician-in-calgary/` | `/calgary-electrician/electrician-in-calgary/` | protected-historical-page | Historical Calgary electrician landing page retained. |
| `/electrician-services/24h-emergency-electrical-services/` | `/electrician-services/24h-emergency-electrical-services/` | protected-historical-page | Historical emergency service route retained. |
| `/contact/` | `/contact/` | protected-historical-page | Canonical contact route. |
| `/electrician-services/cnc-installation-sales/` | `/electrician-services/cnc-installation-sales/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/electrical-inspections/` | `/electrician-services/electrical-inspections/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/electrical-maintenance/` | `/electrician-services/electrical-maintenance/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/electrical-panels-subpanels/` | `/electrician-services/electrical-panels-subpanels/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/fire-alarm-life-safety/` | `/electrician-services/fire-alarm-life-safety/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/hot-tub-installations/` | `/electrician-services/hot-tub-installations/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/industrial-mechanics/` | `/electrician-services/industrial-mechanics/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/ir-thermography-inspections/` | `/electrician-services/ir-thermography-inspections/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/lighting/` | `/electrician-services/lighting/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/main-electrical-service-upgrade/` | `/electrician-services/main-electrical-service-upgrade/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/plugs-switches-wiring/` | `/electrician-services/plugs-switches-wiring/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/robotic-automation-cnc-programming/` | `/electrician-services/robotic-automation-cnc-programming/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/smoke-detector-carbon-monoxide-detector/` | `/electrician-services/smoke-detector-carbon-monoxide-detector/` | historical-service | Distinct historical service page rebuilt at its original URL. |
| `/electrician-services/surge-protection/` | `/electrician-services/surge-protection/` | historical-service | Distinct historical service page rebuilt at its original URL. |

## Permanent one-hop redirects

| SOURCE | DESTINATION | CATEGORY | REASON |
| --- | --- | --- | --- |
| `/contact-us/` | `/contact/` | legacy-page | Legacy contact page alias. |
| `/electrician-services/` | `/our-services/` | legacy-service-hub | One canonical service hub avoids duplicate indexes. |
| `/calgary-electrician/electrician-in-calgary-2/` | `/calgary-electrician/electrician-in-calgary/` | legacy-duplicate | Numbered duplicate of the canonical Calgary page. |
| `/calgary-electrician/electrician-near-me-2/` | `/calgary-electrician/electrician-in-calgary/` | legacy-duplicate | Old local landing page consolidated into the canonical Calgary page. |
| `/electrical-panels/100-amp-panel/` | `/electrician-services/main-electrical-service-upgrade/` | old-service-page | Old 100 amp panel topic maps to the service-upgrade page. |
| `/electrical-panels/200-amp-panel/` | `/electrician-services/main-electrical-service-upgrade/` | old-service-page | Old 200 amp panel topic maps to the service-upgrade page. |
| `/electrician-services/chandelier-installation/` | `/electrician-services/lighting/` | service-consolidation | Chandelier installation is covered by lighting services. |
| `/electrician-services/dental-equipment-repair/` | `/electrician-services/industrial-mechanics/` | service-consolidation | Specialized equipment repair maps to the closest equipment-support service. |
| `/electrician-services/energy-efficient-upgrades/` | `/electrician-services/lighting/` | service-consolidation | Energy-efficient lighting upgrades are the closest current service. |
| `/electrician-services/fire-alarm-life-safety-installs/` | `/electrician-services/fire-alarm-life-safety/` | legacy-duplicate | Duplicate life-safety service slug. |
| `/electrician-services/mechanical-electrical-maintenance/` | `/electrician-services/industrial-mechanics/` | service-consolidation | Industrial electrical/mechanical maintenance is consolidated. |
| `/electrician-services/mechanical-maintenance/` | `/electrician-services/industrial-mechanics/` | service-consolidation | Mechanical maintenance is consolidated into industrial mechanics. |
| `/electrician-services/mechanical-repairs/` | `/electrician-services/industrial-mechanics/` | service-consolidation | Mechanical repair is consolidated into industrial mechanics. |
| `/electrician-services/medical-equipment-repair/` | `/electrician-services/industrial-mechanics/` | service-consolidation | Specialized equipment repair maps to the closest equipment-support service. |
| `/electrician-services/thermography/` | `/electrician-services/ir-thermography-inspections/` | legacy-duplicate | Duplicate thermography topic. |
| `/5-signs-you-need-to-call-an-electrician-this-winter/` | `/residential/` | old-blog-article | Unrecovered winter safety article maps to residential electrical services. |
| `/5-ways-to-conserve-electricity-in-the-city-of-calgary-during-winter/` | `/electrician-services/lighting/` | old-blog-article | Unrecovered conservation article maps to energy-efficient lighting services. |
| `/6-important-benefits-electrical-maintenance-does-for-your-business/` | `/electrician-services/electrical-maintenance/` | old-blog-article | Unrecovered business maintenance article maps to electrical maintenance. |
| `/electrical-panels/100-amp-panel/filter-all/` | `/electrician-services/main-electrical-service-upgrade/` | wordpress-generated-alias | Filter leakage maps to its legitimate panel topic. |
| `/electrical-panels/100-amp-panel/healthcareindustry/` | `/electrician-services/industrial-mechanics/` | wordpress-generated-alias | Healthcare filter maps to the closest equipment-support capability. |
| `/electrical-panels/100-amp-panel/maintenancepackages/` | `/electrician-services/electrical-maintenance/` | wordpress-generated-alias | Maintenance filter maps to electrical maintenance. |
| `/electrical-panels/100-amp-panel/24hemergencyelectricalservices/` | `/electrician-services/24h-emergency-electrical-services/` | wordpress-generated-alias | Emergency filter maps directly to the emergency service. |
| `/calgary-electrician/electrician-in-calgary/filter-all/` | `/calgary-electrician/electrician-in-calgary/` | wordpress-generated-alias | Filter leakage maps to its legitimate parent page. |
| `/calgary-electrician/electrician-in-calgary/healthcareindustry/` | `/electrician-services/industrial-mechanics/` | wordpress-generated-alias | Healthcare filter maps to the closest equipment-support capability. |
| `/calgary-electrician/electrician-in-calgary/maintenancepackages/` | `/electrician-services/electrical-maintenance/` | wordpress-generated-alias | Maintenance filter maps to electrical maintenance. |
| `/calgary-electrician/electrician-near-me-2/maintenancepackages/` | `/electrician-services/electrical-maintenance/` | wordpress-generated-alias | Maintenance filter maps directly to electrical maintenance. |
| `/electrician_services/` | `/our-services/` | underscore-alias | Legacy underscore service namespace. |
| `/electrician_services/cnc-installation-sales/` | `/electrician-services/cnc-installation-sales/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/electrical-inspections/` | `/electrician-services/electrical-inspections/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/electrical-maintenance/` | `/electrician-services/electrical-maintenance/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/electrical-panels-subpanels/` | `/electrician-services/electrical-panels-subpanels/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/fire-alarm-life-safety/` | `/electrician-services/fire-alarm-life-safety/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/hot-tub-installations/` | `/electrician-services/hot-tub-installations/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/industrial-mechanics/` | `/electrician-services/industrial-mechanics/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/ir-thermography-inspections/` | `/electrician-services/ir-thermography-inspections/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/lighting/` | `/electrician-services/lighting/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/main-electrical-service-upgrade/` | `/electrician-services/main-electrical-service-upgrade/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/plugs-switches-wiring/` | `/electrician-services/plugs-switches-wiring/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/robotic-automation-cnc-programming/` | `/electrician-services/robotic-automation-cnc-programming/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/smoke-detector-carbon-monoxide-detector/` | `/electrician-services/smoke-detector-carbon-monoxide-detector/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/surge-protection/` | `/electrician-services/surge-protection/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/chandelier-installation/` | `/electrician-services/lighting/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/dental-equipment-repair/` | `/electrician-services/industrial-mechanics/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/energy-efficient-upgrades/` | `/electrician-services/lighting/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/fire-alarm-life-safety-installs/` | `/electrician-services/fire-alarm-life-safety/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/mechanical-electrical-maintenance/` | `/electrician-services/industrial-mechanics/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/mechanical-maintenance/` | `/electrician-services/industrial-mechanics/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/mechanical-repairs/` | `/electrician-services/industrial-mechanics/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/medical-equipment-repair/` | `/electrician-services/industrial-mechanics/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |
| `/electrician_services/thermography/` | `/electrician-services/ir-thermography-inspections/` | underscore-alias | Legacy underscore namespace maps directly to the final canonical service URL. |

## Technical endpoint exceptions

These are deliberately outside the commercial migration map and are not redirected to electrical content.

| SOURCE | CATEGORY | REASON |
| --- | --- | --- |
| `/apple-app-site-association` | technical-endpoint | Apple Universal Links endpoint; not historical PES content. |
| `/.well-known/apple-app-site-association` | technical-endpoint | Apple Universal Links endpoint; not historical PES content. |

Obvious WordPress administration/system URLs, APIs, security probes, media files, and random bot attacks are also excluded by policy because they are not former PES content URLs.

## Adding later evidence

If an additional export or workbook is mounted later, normalize each legitimate PES content path and add it to `legacyUrlMap` as either `rebuild` or `redirect`. A redirect destination must itself be a rebuilt entry, which guarantees direct final destinations. Then run `npm run legacy:check` and `npm run build` before release.
