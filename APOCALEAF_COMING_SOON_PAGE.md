# Apocaleaf Coming Soon Page

## Route

`/apocaleaf`

## Concept

A short, in-world F.A.M.I.N.E. pre-issue field file using the actual Apocaleaf Standard Issue assets and visual system:

- Standard Issue parchment and ledger grid
- Oxblood archive ink
- Acid-green operational signal
- Real Apocaleaf seal and F.A.M.I.N.E. approval ring
- Botanical field-guide illustration texture
- Flat amber safety notice

## Interaction

The dossier begins redacted. Selecting **Stamp to open file**:

1. Removes the redactions.
2. Reveals the three field directives.
3. Marks the dossier **FILE ACCEPTED**.
4. Changes the closing line to **Your cooperation has been noted.**

The control is keyboard accessible, uses `aria-expanded` and `aria-live`, and honours `prefers-reduced-motion`.

## Files added

- `src/pages/Apocaleaf.jsx`
- `src/pages/apocaleaf.css`
- `public/apocaleaf/apocaleaf-og.webp`
- `public/apocaleaf/field-guide-bg.webp`
- `public/apocaleaf/wildflowers.webp`
- `public/apocaleaf/standard-issue-mark.webp`
- `public/apocaleaf/print-noise.webp`

## Files updated

- `src/App.jsx`
- `src/components/Nav.jsx`
- `src/components/Footer.jsx`
- `src/pages/Savor.jsx`
- `prerender.js`
- `generate-sitemap.js`

The existing Savor-page Apocaleaf teaser now links to `/apocaleaf`.

## SEO

- Title: `Apocaleaf — Post-Apocalyptic Foraging Game | Coming Soon`
- Description: `Apocaleaf is a post-apocalyptic foraging game where Citizens locate edible plants, file field reports, earn Scrip, and rebuild the archive.`
- Canonical: `https://getsavor.recipes/apocaleaf`
- Open Graph image: `/apocaleaf/apocaleaf-og.webp`
- Included in prerendering and the generated sitemap.

## Verification

- Desktop visual render: 1440 × 1100
- Mobile visual render: 390 × 844
- Initial and accepted interaction states inspected
- Exactly one H1
- Relative import sweep passed
- TypeScript parser sweep passed across all JS/JSX/MJS files
- Route, metadata, sitemap, and asset assertions passed

A complete Vite build could not run in the current environment because the configured package mirror returned HTTP 404 for dependency tarballs. No source parser or import errors were found.
