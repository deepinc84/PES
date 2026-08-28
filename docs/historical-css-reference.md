# Historical stylesheet reference

## Provenance

The owner supplied a legacy Platinum Electrical Services CSS listing directly in the archive-recovery task. It is first-party historical source material, but its source URL, filename, associated HTML, and exact deployment date were not supplied. It is therefore classified as **HISTORICAL SITE SOURCE / likely landing-page stylesheet**, not as a recovered March 2022 Wayback page.

The machine-readable analysis is stored in `data/archive/artifacts.json`. This document records what the stylesheet proves, what it suggests, and what must not be inferred from it.

## Reliable historical design evidence

| Evidence | Recovered detail | Modern implication |
| --- | --- | --- |
| Brand colour | Repeated `#dd2027` red with `#6d6e71` grey | Supports the current red, charcoal, white and grey direction; do not reintroduce orange or blue. |
| Typography | `Open Sans`, 15px/22px body | Confirms a legible sans-serif tradition, but does not require restoring a remote or unlicensed font. |
| Company imagery | `.vanImage` displayed prominently | The real branded van is a meaningful company asset when the original image file is supplied. |
| Contact hierarchy | `.contactBox`, `.btn-small`, and a large `.callSec` form | Service requests and contact actions were historically prominent and should remain actionable. |
| Message hierarchy | `.stripRed`, `.stripGrey`, `.bigStrip`, `.smallStrip` | Supports compact red/grey emphasis bands, but not mechanically reproducing the old strips. |
| Content structure | Left information panel, middle checklist, right call form | Indicates a service explanation/checklist/response pattern that can inform modern page structure. |
| Process/about | `.stepSec` and `.aboutSec` | Shows that the historical site explained process and company positioning. Copy is still required. |
| Responsive intent | Four fixed viewport ranges | Shows mobile intent, but the implementation is dated and should not be reused. |

## Asset references discovered

The CSS references a legacy Font Awesome bundle and `../images/tick.png`. It does **not** expose the service-van filename despite defining `.vanImage`. These are now inventoried, but none should be published without the original files and provenance review.

## Deliberately rejected legacy presentation

The production application should not import or closely reproduce this CSS. Specifically:

- Do not restore dotted promotional borders, eight-pixel panel borders, large rounded submit controls, or fixed breakpoint bands.
- Do not restore the legacy Font Awesome files merely for icons.
- Do not publish testimonial stars or testimonial content without verified first-party text and permission.
- Do not infer a telephone number from the existence of `.contactBox`.
- Do not infer the quote form was functional from CSS alone.
- Do not treat the yellow testimonial-star colour as a current brand colour.
- Do not copy the small 11–12px body text sizes into the accessible modern site.

## Content still missing

CSS supplies component names and visual intent, not the associated HTML or page wording. Archive replay or owner-supplied HTML is still required to recover:

- Strip headlines and supporting messages.
- Service checklist text.
- Quote-form labels and consent language.
- Process-step headings and descriptions.
- About-section paragraphs.
- Any historical call-to-action wording.
- The van and tick-image source URLs.
- Page title, meta description, canonical URL and internal links.

## Recommendation

Use this artifact in the second-stage design review after page content is recovered. It strengthens the evidence for a white/red/grey/black Platinum identity, prominent real van imagery, direct service-request actions, and concise technical checklists. It does not justify changing historical route decisions or publishing unverified copy.
