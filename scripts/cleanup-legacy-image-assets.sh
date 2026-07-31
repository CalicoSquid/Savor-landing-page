#!/usr/bin/env bash
set -euo pipefail

find public -type f \( -iname '*.png' -o -iname '*.jpg' -o -iname '*.jpeg' \) -delete
rm -rf public/forage dist
rm -f optimize-assets.mjs

echo "Legacy raster assets and stale build output removed. Run npm run build next."
