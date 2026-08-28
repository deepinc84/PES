# Legacy URL migration audit

## Scope and evidence

This audit uses the protected routes, historical service inventory, approximate backlink totals, spam examples, and taxonomy examples supplied with the rebuild brief. The referenced `seo architecture.xlsx` attachment was **not present in the repository or mounted workspace at implementation time**. Accordingly, decisions that depend on row-level referring-domain or anchor analysis are explicitly held for manual review rather than inferred from raw totals.

The later-referenced PES JPG, AI, EPS, and PDF brand files were also not present in the checkout or mounted workspace. The application therefore uses an explicitly documented text fallback—not a newly traced or invented symbol—until the approved red/black horizontal artwork and compact mark can be added without altering them.

## 1. Protected historical URLs

These high-value routes are live content pages and are not redirected:

| URL | Action | Reason |
| --- | --- | --- |
| `/` | REBUILD | Primary brand and Calgary electrician destination; supplied estimate of 273 backlinks / 108 referring domains. |
| `/our-services/` | REBUILD | Historical human-facing service hub; supplied estimate of 51 backlinks / 36 referring domains. |
| `/residential/` | REBUILD | Historical residential hub; supplied estimate of 44 backlinks / 10 referring domains. |
| `/calgary-electrician/electrician-in-calgary/` | REBUILD | Important local landing page; supplied estimate of 116 backlinks / 60 referring domains. |
| `/electrician-services/24h-emergency-electrical-services/` | REBUILD | Important emergency landing page; supplied estimate of 129 backlinks / 45 referring domains. |
| `/contact/` | REBUILD | Historical user destination and required contact route. |

## 2. Historical URLs rebuilt directly

The initial release also rebuilds substantive pages at `/electrician-services/` children for electrical inspections, electrical maintenance, panels and subpanels, hot tubs, IR thermography, lighting, main service upgrades, outlets/switches/wiring, smoke and CO detectors, surge protection, fire alarm/life safety, CNC support, industrial mechanics, and robotic automation/CNC support.

These pages were selected because they represent distinct user intent and fit the residential, commercial, or industrial architecture. The emergency page is separately protected above. `/electrician-services/` itself is not maintained as a competing hub; it redirects to `/our-services/`.

## 3. Historical URLs redirected

The executable source of truth is `data/legacy-redirects.js`. All migrations are permanent and point directly to a final live route.

| OLD URL | NEW URL | ACTION | REASON |
| --- | --- | --- | --- |
| `/electrician-services/` | `/our-services/` | 301 | One primary service hub avoids competing indexes. |
| `/electrician-services/chandelier-installation/` | `/electrician-services/lighting/` | 301 | Chandelier work is a subset of lighting. |
| `/electrician-services/dental-equipment-repair/` | `/electrician-services/industrial-mechanics/` | 301 | Consolidated specialized equipment support. |
| `/electrician-services/energy-efficient-upgrades/` | `/electrician-services/lighting/` | 301 | Closest live upgrade intent. |
| `/electrician-services/fire-alarm-life-safety-installs/` | `/electrician-services/fire-alarm-life-safety/` | 301 | Duplicate historical topic. |
| `/electrician-services/mechanical-electrical-maintenance/` | `/electrician-services/industrial-mechanics/` | 301 | Consolidated industrial maintenance topic. |
| `/electrician-services/mechanical-maintenance/` | `/electrician-services/industrial-mechanics/` | 301 | Consolidated industrial maintenance topic. |
| `/electrician-services/mechanical-repairs/` | `/electrician-services/industrial-mechanics/` | 301 | Consolidated industrial repair topic. |
| `/electrician-services/medical-equipment-repair/` | `/electrician-services/industrial-mechanics/` | 301 | Closest live equipment-support capability. |
| `/electrician-services/thermography/` | `/electrician-services/ir-thermography-inspections/` | 301 | Duplicate thermography topic. |

## 4. Historical garbage/taxonomy URLs discarded

The following supplied examples are not recreated and intentionally resolve as not found unless row-level evidence later justifies a targeted redirect:

- `/electrical-panels/100-amp-panel/24hemergencyelectricalservices`
- `/electrical-panels/100-amp-panel/filter-all`
- `/electrical-panels/100-amp-panel/healthcareindustry`
- `/calgary-electrician/electrician-in-calgary/filter-all`
- `/calgary-electrician/electrician-in-calgary/healthcareindustry`
- `/calgary-electrician/electrician-near-me-2/maintenancepackages`

Their nested, unrelated modifier patterns are consistent with WordPress filter/taxonomy leakage. They are not mass-redirected to the homepage. Additional URLs matching these patterns should remain gone unless the workbook shows a legitimate, topically relevant referring domain and an unambiguous semantic destination.

## 5. URLs requiring manual review

Row-level review is still required for (a) every garbage combination in the missing workbook that has one or more legitimate referring domains, (b) historical URLs outside the supplied inventory, and (c) the specialized dental and medical equipment URLs if their backlinks demonstrate meaningful healthcare-specific intent. The latter currently consolidate to industrial mechanics rather than creating thin pages.

The business owner must also provide verified public phone, email, address, hours, licensing details, and emergency availability language before those facts are published. In particular, the historic `24h` slug has been preserved without inventing a guarantee that staff answer around the clock.

## 6. Backlink-quality observations

Raw backlink counts alone were not treated as quality signals. Protected-route decisions combine the supplied counts with clear navigational/local/service intent. Anchors advertising backlink sales, dofollow packages, PBNs, or unrelated services should not influence page creation. Business citations, Calgary references, electrical-industry links, company profiles, and contextually relevant links should receive priority during workbook review.

## 7. Canonical hostname rules

Every indexable page emits a canonical based on `https://pt-electrical.com`. The `www.pt-electrical.com` host is permanently redirected in one hop to the same path on the non-www HTTPS hostname. Vercel should continue enforcing HTTP-to-HTTPS at the platform edge. Sitemap, robots host declaration, metadata base, and Open Graph URL all use `https://pt-electrical.com`; no DNS, email, Search Console, or Vercel project settings are changed by this repository.
