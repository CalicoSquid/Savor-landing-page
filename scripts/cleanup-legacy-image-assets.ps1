# Run once after extracting this pass over an existing checkout.
# The optimized WebP files are already present; this removes obsolete source formats
# and generated build output that may still contain stale image references.
Get-ChildItem -Path public -Recurse -File -Include *.png,*.jpg,*.jpeg -ErrorAction SilentlyContinue |
  Remove-Item -Force

Remove-Item -Recurse -Force public\forage, dist -ErrorAction SilentlyContinue
Remove-Item -Force optimize-assets.mjs -ErrorAction SilentlyContinue

Write-Host "Legacy raster assets and stale build output removed. Run npm run build next."
