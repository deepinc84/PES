# PES web brand assets

This directory is reserved for approved, web-ready Platinum Electrical Services artwork.

The historical JPG, AI, EPS, and PDF files referenced in the design brief were not present in the repository or mounted workspace, so no substitute logo bitmap, inaccurate trace, or generic electrical icon has been committed. Once supplied, add only the chosen exports using these names:

- `pes-logo-horizontal.svg` (or `.jpg` when no trustworthy vector conversion is possible)
- `pes-logo-mark.png` for the favicon/app icon
- `pes-logo-dark-background.svg` only if the approved artwork includes a distinct reversed treatment

The header/footer currently expose an accessible contents-only fallback in `components/site.js`. Replace that fallback with `next/image`, include the artwork's real intrinsic dimensions, and generate `app/icon.png` from the approved compact PES mark.
