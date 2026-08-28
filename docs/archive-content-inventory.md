# Platinum Electrical Services archive content inventory

## Recovery status

**Status: ARCHIVE RETRIEVAL REQUIRED.** On August 28, 2026, the execution environment proxy rejected every HTTPS CONNECT request to `web.archive.org` with HTTP 403. Two CDX host-pattern queries, the known March 31, 2022 raw replay, retries, and the Arquivo.pt/Common Crawl discovery fallbacks were attempted sequentially. The configured web connector independently returned HTTP 401. No archived wording has been inferred or copied from the current site.

The machine-readable failure record is `data/archive/retrieval-failures.json`. The resumable recovery command is `npm run archive:recover`; it uses a 1.25-second inter-request delay, three bounded attempts with backoff, SHA-256 response caching, two in-scope host patterns, and no concurrent requests. It writes only under `data/archive/` and never changes production pages.

## Counts

| Measure | Count | Basis |
| --- | ---: | --- |
| Owner-supplied candidate content URLs inventoried | 30 | Explicit routes in the task |
| Additional owner-identified malformed URLs inventoried | 4 | Explicit garbage examples in the task |
| CDX-discovered URLs | 0 | Discovery blocked; **not** evidence that no captures exist |
| Seed URLs classified as real content pages | 20 | Historical role and distinct intent |
| Seed URLs classified as legacy duplicates | 10 | Existing audited consolidation decisions |
| Seed URLs classified as WordPress/taxonomy garbage | 4 | Owner-identified malformed patterns |
| Pages successfully recovered | 0 | Internet Archive unavailable |

## Candidate real content pages

The null title, snapshot, metadata, content, link, and image fields in `pages.json` are deliberate. “No” below means retrieval failed—not that the archived page lacked content.

| HISTORICAL URL | ARCHIVE SNAPSHOT | PAGE TITLE | CONTENT RECOVERED? | CURRENT / PLANNED ROUTE | RECOMMENDED ACTION |
| --- | --- | --- | --- | --- | --- |
| `/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/` | REBUILD AT SAME URL |
| `/our-services/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/our-services/` | REBUILD AT SAME URL |
| `/residential/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/residential/` | REBUILD AT SAME URL |
| `/contact/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/contact/` | REBUILD AT SAME URL |
| `/calgary-electrician/electrician-in-calgary/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/calgary-electrician/electrician-in-calgary/` | REBUILD AT SAME URL |
| `/electrician-services/24h-emergency-electrical-services/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/24h-emergency-electrical-services/` | REBUILD AT SAME URL |
| `/electrician-services/cnc-installation-sales/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/cnc-installation-sales/` | REBUILD AT SAME URL |
| `/electrician-services/electrical-inspections/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/electrical-inspections/` | REBUILD AT SAME URL |
| `/electrician-services/electrical-maintenance/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/electrical-maintenance/` | REBUILD AT SAME URL |
| `/electrician-services/electrical-panels-subpanels/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/electrical-panels-subpanels/` | REBUILD AT SAME URL |
| `/electrician-services/fire-alarm-life-safety/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/fire-alarm-life-safety/` | REBUILD AT SAME URL |
| `/electrician-services/hot-tub-installations/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/hot-tub-installations/` | REBUILD AT SAME URL |
| `/electrician-services/industrial-mechanics/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/industrial-mechanics/` | REBUILD AT SAME URL |
| `/electrician-services/ir-thermography-inspections/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/ir-thermography-inspections/` | REBUILD AT SAME URL |
| `/electrician-services/lighting/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/lighting/` | REBUILD AT SAME URL |
| `/electrician-services/main-electrical-service-upgrade/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/main-electrical-service-upgrade/` | REBUILD AT SAME URL |
| `/electrician-services/plugs-switches-wiring/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/plugs-switches-wiring/` | REBUILD AT SAME URL |
| `/electrician-services/robotic-automation-cnc-programming/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/robotic-automation-cnc-programming/` | REBUILD AT SAME URL |
| `/electrician-services/smoke-detector-carbon-monoxide-detector/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/smoke-detector-carbon-monoxide-detector/` | REBUILD AT SAME URL |
| `/electrician-services/surge-protection/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/surge-protection/` | REBUILD AT SAME URL |

## Candidate legacy duplicates and consolidations

These recommendations remain provisional until archived content and backlink rows can confirm whether each page was genuinely duplicative.

| HISTORICAL URL | ARCHIVE SNAPSHOT | PAGE TITLE | CONTENT RECOVERED? | CURRENT / PLANNED ROUTE | RECOMMENDED ACTION |
| --- | --- | --- | --- | --- | --- |
| `/electrician-services/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/our-services/` | 301 TO NEW PAGE |
| `/electrician-services/chandelier-installation/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/lighting/` | 301 TO NEW PAGE |
| `/electrician-services/dental-equipment-repair/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/industrial-mechanics/` | 301 TO NEW PAGE |
| `/electrician-services/energy-efficient-upgrades/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/lighting/` | 301 TO NEW PAGE |
| `/electrician-services/fire-alarm-life-safety-installs/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/fire-alarm-life-safety/` | 301 TO NEW PAGE |
| `/electrician-services/mechanical-electrical-maintenance/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/industrial-mechanics/` | 301 TO NEW PAGE |
| `/electrician-services/mechanical-maintenance/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/industrial-mechanics/` | 301 TO NEW PAGE |
| `/electrician-services/mechanical-repairs/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/industrial-mechanics/` | 301 TO NEW PAGE |
| `/electrician-services/medical-equipment-repair/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/industrial-mechanics/` | 301 TO NEW PAGE |
| `/electrician-services/thermography/` | ARCHIVE RETRIEVAL REQUIRED | — | No | `/electrician-services/ir-thermography-inspections/` | 301 TO NEW PAGE |

## Rejected malformed/taxonomy examples

| HISTORICAL URL | CLASSIFICATION | ACTION | NOTES |
| --- | --- | --- | --- |
| `/electrical-panels/100-amp-panel/filter-all` | WORDPRESS/TAXONOMY GARBAGE | DISCARD | Do not recreate; reconsider only with meaningful backlink evidence. |
| `/electrical-panels/100-amp-panel/healthcareindustry` | WORDPRESS/TAXONOMY GARBAGE | DISCARD | Do not recreate; reconsider only with meaningful backlink evidence. |
| `/calgary-electrician/electrician-in-calgary/filter-all` | WORDPRESS/TAXONOMY GARBAGE | DISCARD | Do not recreate; reconsider only with meaningful backlink evidence. |
| `/calgary-electrician/electrician-near-me-2/maintenancepackages` | WORDPRESS/TAXONOMY GARBAGE | DISCARD | Do not recreate; reconsider only with meaningful backlink evidence. |

## Current-site comparison

### Content represented by current routes

The current rebuild has routes for the six protected destinations plus 14 focused service pages. Route presence does **not** mean the historical content was recovered: existing prose was written before archive access and must not be mislabeled as archived Platinum copy.

### Content that still needs archive-led modernization

All 20 candidate real pages require source recovery and comparison. Particular priorities are the homepage, services hub, residential hub, Calgary electrician page, emergency page, electrical maintenance, industrial mechanics, CNC/automation, fire alarm/life safety, and IR thermography. The current homepage also lacks archive-verified technical details and should remain unchanged during this recovery phase.

### Historical services currently consolidated

Chandelier installation, energy-efficient upgrades, specialized dental/medical equipment repair, three mechanical-maintenance/repair slugs, duplicate fire-alarm wording, and the shorter thermography slug currently redirect. Archive review may support merging their distinct technical material into the planned destination even when the old slug remains redirected.

### Content that should not return

Owner-identified filter/taxonomy combinations should not become production pages. The recovery script additionally classifies WordPress administration/system paths, upload attachments, and known leakage segments separately before extracting content.

## Correction-document comparison

No DOCX correction files were present in the repository, `/workspace`, or `/tmp`; therefore no archived-versus-correction conflict can yet be evaluated. Required inputs are `List of Services.docx`, `Mechanical page deficiencies.docx`, `New Pages to be edited and uploaded.docx`, `service page deficiencies updated.docx`, `Electrical page deficiencies.docx`, and `Home page deficiencies updated.docx`. `off other websites.docx` must be stored and labeled research-only and must never supply production wording.

For each available correction file, the next comparison pass must record: archived version, correction-document version, the specific conflict, and a recommendation. It must not silently select either text.

## Owner-supplied historical stylesheet

A first-party legacy CSS listing has now been analyzed separately in `data/archive/artifacts.json` and `docs/historical-css-reference.md`. It provides reliable evidence for the historical red/grey palette, Open Sans body typography, prominent van imagery, contact/quote intent, promotional strips, service checklists, process steps, and an about section. It does not contain recoverable page copy, URLs, metadata, telephone details, or the van image filename. It is design evidence rather than a recovered Wayback page and must not be counted among successfully recovered HTML pages.

## Image recovery inventory

No archived image references could be extracted. `data/archive/images.json` intentionally remains empty. After replay access, every reference must be classified as `LOGO/BRAND ASSET`, `LIKELY COMPANY ASSET`, `LIKELY STOCK IMAGE`, or `UNKNOWN`. Priority manual candidates are PES logo artwork, the branded service van, identifiable company/project imagery, and thermography/equipment images. Archived stock/template images must not be published automatically.

## Retrieval plan when access is restored

1. Run `npm run archive:recover` once; cached responses prevent repeat downloads.
2. Review every generated Markdown file against its raw replay before treating extraction as faithful.
3. Import the spreadsheet and correction documents and record conflicts separately.
4. Manually classify image provenance and licensing.
5. Approve an editorial modernization layer without changing raw archive files.
6. Only then update production copy, with internal provenance such as `Platinum Electrical Services Wayback archive, March 2022`.
