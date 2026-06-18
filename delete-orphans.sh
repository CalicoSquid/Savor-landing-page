#!/usr/bin/env bash
# delete-orphans.sh — removes public/ assets that nothing in the codebase
# references. Reviewed by hand: the 12 theme icons (icon-*.webp) are USED
# dynamically via getIcon() and are NOT in this list.
#
# Review, then run from the repo root:  bash delete-orphans.sh
set -e
cd "$(dirname "$0")"

before=$(du -sm public | cut -f1)

# ── Unused theme/preview screenshots (the 4 used ones are now .webp) ──────────
rm -f public/screenshots/watermelon.png  public/screenshots/watermelon1.png
rm -f public/screenshots/lime.png        public/screenshots/lime1.png
rm -f public/screenshots/blueberry.png   public/screenshots/blueberry1.png
rm -f public/screenshots/dragonfruit.png public/screenshots/dragonfruit1.png
rm -f public/screenshots/tangerine.png   public/screenshots/tangerine1.png
rm -f public/screenshots/home.png        public/screenshots/cscfull.png

# ── Old Potluck slot-machine / ASO assets (new page doesn't use them) ─────────
rm -f public/potluck/Potluck_ASO_Fate3.png public/potluck/Potluck_ASO_Destiny2.png
rm -f public/potluck/potluck_ASO_Hero.png  public/potluck/potluck-splash.png
rm -f public/potluck/bg.png public/potluck/fate.png public/potluck/supper2.png public/potluck/rays.png

# ── Misc unreferenced images/icons ───────────────────────────────────────────
rm -f public/images/csc_WO.png public/images/cscfull_WOT.png
rm -f public/images/Untitled.jpg public/images/savor-wordmark.png
rm -f public/icons/default-avatar.png public/icons/Savor2.png

# ── KEEP-FOR-NOW (uncomment if you're sure you won't build a Forage page) ─────
# rm -f public/forage/wordmarknew.png public/forage/leaf.png public/forage/campfire.png

after=$(du -sm public | cut -f1)
echo "✓ public/ : ${before} MB → ${after} MB  (reclaimed $((before - after)) MB)"