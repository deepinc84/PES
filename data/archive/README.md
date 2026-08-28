# Platinum Electrical Services historical archive dataset

This directory separates recovered source material from production content.

- `pages.json` is the machine-readable URL/page inventory.
- `content/` receives faithful cleaned Markdown only after successful replay retrieval.
- `images.json` records image references and manual provenance classifications.
- `artifacts.json` records owner-supplied historical source artifacts that are not archived HTML pages.
- `retrieval-failures.json` records blocked or failed requests.
- `cache/` is the local response cache and is ignored by Git except for `.gitkeep`.

Run `npm run archive:recover` when `web.archive.org` is reachable. The script scopes discovery to `pt-electrical.com` and `www.pt-electrical.com`, prefers the capture nearest March 31, 2022, throttles serial requests, retries with backoff, caches every response, strips replay/navigation noise, and does not write to `app/` or other production paths.

Null extraction fields mean **not retrieved**, never “historically absent.” Raw historical wording must be reviewed before production use and must never be overwritten by modernization work.
