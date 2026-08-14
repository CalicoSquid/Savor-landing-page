# Potluck Web — launch polish pass

This pass keeps the working Potluck Web product intact and focuses on theatre, personality, sharing and measurable funnel behaviour.

## What changed

- Added a staged spin rhythm: chatter changes mid-spin, a short "sealing the timeline" beat lands before reveal, and the wheel gets a subtle cosmic scan / cabinet motion.
- Result content now arrives as one deliberate reveal block; typewriter verdict remains canonical Potluck voice.
- Reroll escalation remains wired to the native Potluck copy pools.
- 86 / The Void is more deliberately tempting and more Potluck-coded when refused.
- Third-spin app interruption now looks like a transmission and carries a tighter app proposition.
- Share copy now rotates through Potluck-specific verdict lines instead of a generic sentence.
- The app section is visually separated as "app territory" and makes This Week / The Void / memory the reasons to install.
- Potluck × Savor stays secondary. The free theme is presented as an actual cosmic gift rather than a generic promotion.
- Updated Potluck social preview image and SEO copy around "random dinner generator" / "what to cook tonight" without changing the product voice.
- Mobile first-screen spacing tightened so the core spin stays dominant.

## Funnel events

The companion recipe-api pass adds a tiny anonymous `POST /potluck-event` endpoint. The site records:

- `visit`
- `three_spins` (unique browser milestone)
- `recipe_click`
- `potluck_app_click`
- `savor_click`
- `theme_claim_click`
- `share`
- `void_tease`

`/potluck-stats` now also exposes the corresponding aggregate counters plus unique web visitors and unique browsers that reached three spins.

The same random local browser token already used for `webSpinners` is used for the unique funnel milestones. The API SHA-256 hashes it before storage. No account, raw token, IP-derived identifier or browser fingerprint is stored.

## Deploy order

1. Deploy the companion recipe-api zip first.
2. Deploy this site zip second.
3. Hard-refresh `/potluck/` once the site deploy is live.

The site still works if event tracking fails; analytics calls are fire-and-forget and never block spin/share/navigation.

## Test pass

1. Load `/potluck/` on desktop and a real phone.
2. First spin: confirm reel chatter changes, "Sealing the timeline…" appears briefly, then the result lands and types its verdict.
3. Reroll twice: confirm reroll labels escalate and the third result triggers the Universe transmission after the verdict finishes.
4. Dismiss the transmission, refresh, and confirm it does not immediately harass you again in that browser.
5. Tap 86 and confirm the dark Void refusal/CTA.
6. Share a verdict and confirm native share on mobile or clipboard fallback on desktop.
7. Test See recipe, Potluck Play links, Meet Savor and Accept the gift.
8. Confirm `/potluck-stats` increments the new fields after a few seconds.
9. Check mobile first screen at small-phone width: wordmark, question, wheel and spin/result should remain the dominant content.

## Deliberately not included

- No accounts or web recipe history.
- No functional Web Void.
- No web This Week.
- No fake Savor-theme screenshot. The remote theme can evolve without making this page stale.
- No new site dependencies.
