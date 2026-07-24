# Caper website rebrand

Updated the public website from Forage to Caper.

## Public changes
- Added `/caper` as the canonical product page.
- Added `/caper/privacy` and `/caper/delete-account`.
- Kept the previous `/forage` routes as compatibility aliases and added Netlify 301 redirects.
- Replaced the public wordmark and icon assets with the selected Caper brand set.
- Updated navigation, footer, Savor cross-promotion, metadata, social preview data, privacy copy, account-deletion copy, sitemap and prerender configuration.
- Kept the Play Store package URL unchanged (`com.calicosquid.forage`) because the application ID must remain stable for the existing closed-test listing.

## Build note
A full build could not be completed in this environment because dependency installation did not finish within the available execution window. Source/configuration checks and asset-path checks were completed. Run `npm install` followed by `npm run build` locally before deployment.
