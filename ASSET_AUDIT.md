# Website Image Asset Audit and Optimization Pass

## Scope

This pass audits every local raster asset in the website project and optimizes the production source without changing page copy, layout, routing, or visual design.

The work covers:

- local files in `public/`
- image references in React, CSS, prerender metadata, structured data, and the recipe edge function
- intrinsic image dimensions and browser loading behaviour
- duplicate and dead assets
- stale generated `dist/` output

Remote recipe photographs returned by the API and the external SEO Receipts badge are not transcoded because they are not owned local assets. Their rendered dimensions are reserved to prevent layout shift.

## Results

| Metric | Before | After | Change |
|---|---:|---:|---:|
| Local raster assets | 78 | 65 | 13 fewer |
| PNG/JPEG assets | 31 | 0 | fully removed |
| Local raster payload | 26.82 MB | 3.44 MB | **87.2% smaller** |
| Duplicate raster files | 16 groups | 0 | fully deduplicated |
| JSX `<img>` elements with explicit dimensions | inconsistent | 48 / 48 | complete |

The largest source of waste was the obsolete `public/forage/` tree, which duplicated the live Caper artwork byte-for-byte. `/forage` already renders the Caper route, so the duplicate tree was removed.

## Conversion and sizing decisions

### Apocaleaf

- Converted the seal, approval ring, print texture, splash mark, and social graphic to WebP.
- Reduced the Standard Issue mark from 1024px to 512px for its real maximum rendered size.
- Reduced the teaser-only splash mark to 256px.
- Added 512px and 960px responsive wildflower artwork.
- Added a 384px field-guide background for standard-density displays while preserving the 768px version for high-density displays.
- Updated Open Graph metadata to the 1200×630 WebP social image.

### Caper and `/forage`

- Converted all four feature screenshots to WebP.
- Added 360px and 720px responsive variants; the cards render at a maximum of roughly 340 CSS pixels.
- Reduced the Caper wordmark to 480px and 960px responsive variants.
- Reduced the app icon to 160px for its 40–56px rendered use.
- Reduced the campfire phone image to 360px and 720px variants.
- Reduced the social graphic from 1792px to 1200px wide.
- Changed the seasonal explorer so the browser loads only the active season artwork instead of downloading all four backgrounds immediately.
- Removed the obsolete duplicate Forage asset directory and dead duplicate image references.

### Savor

- Added 240px and 480px variants for the phone screenshots.
- Added 640px and 1000px variants for the Preserve feature image.
- Reduced all 12 theme icons to 160px, sufficient for their largest 62px rendered use on high-density displays.
- Added a dedicated 480px UI wordmark while retaining a 1200px WebP for social metadata.
- Added 800px and 1600px variants for the lasagne demo photograph.
- Reduced the Studio phone screenshot to 480px wide and the inverted wordmark to 480px.
- Restored a real optimized default avatar fallback for recipe pages.

### Potluck

- Converted the Google Play badge and social image to WebP.
- Reduced the Play badge from 1500px to 440px for its 56px rendered height.
- Reduced the wheel cabinet from 1024px to 640px and the app icon to 192px.
- Reduced the wordmark from 1536px to 640px.
- Removed duplicate Savor icon bytes and an unused legacy wordmark.

## Browser loading improvements

- Every local JSX image now has explicit `width` and `height` attributes to reserve aspect-ratio space and reduce cumulative layout shift.
- Above-the-fold brand/LCP images use eager loading and `fetchPriority="high"` where appropriate.
- Below-the-fold screenshots, store badges, and decorative imagery use lazy loading and asynchronous decoding.
- Large responsive images use `srcSet` and `sizes`, allowing the browser to select the smallest suitable file.
- CSS artwork uses density-aware `image-set()` with a normal URL fallback.
- Open Graph image paths, formats, and declared dimensions were updated to match the new files.
- Favicon MIME declarations were corrected; SVG is primary, ICO remains as a compatibility fallback.

## Removed assets

The pass removes:

- all local PNG and JPEG files
- the duplicate `public/forage/` asset tree
- unused Caper ASO exports and legacy branding
- unused Savor and Studio images
- stale screenshot exports
- duplicate app icons and wordmarks
- the obsolete one-shot `optimize-assets.mjs`
- stale generated `dist/` output, which must be rebuilt from source

## Guardrail added

Run:

```bash
npm run audit:assets
```

The audit fails when it finds:

- a local PNG/JPEG/GIF or other legacy raster format
- a missing local image reference
- an `<img>` without explicit width and height
- a broken asset path

It also reports the total raster payload and the ten largest assets.

## Overlay cleanup

If this pass is extracted over an existing checkout, old files are not deleted automatically. Run one included cleanup helper before rebuilding:

### PowerShell

```powershell
.\scripts\cleanup-legacy-image-assets.ps1
```

### Bash / Git Bash

```bash
bash scripts/cleanup-legacy-image-assets.sh
```

Then rebuild:

```bash
npm ci
npm run audit:assets
npm run build
```

## Verification completed

- Asset audit passed: 65 local raster assets, 0 legacy raster files, 3.44 MB total.
- All 43 literal local image references resolve.
- All responsive variants referenced dynamically exist.
- All 48 JSX image elements have explicit width, height, and async decoding.
- No duplicate raster files remain.
- TypeScript parser sweep passed across all 43 JS/JSX/MJS files.
- Relative import audit passed across 62 source module edges; the one expected `.ssr` build artifact import was excluded.
- Key converted assets were visually inspected at output resolution.

A complete Vite production build could not be run in this environment because the configured package mirror returned a 404 for `zod-validation-error@4.0.2` during `npm ci`. The failure occurred before project dependencies were installed and is unrelated to the source or image changes.
