# Website analytics

GA4 website stream: `G-FVYNQFT5Y9`, in Savor property `454500439`.
The earlier `G-3XL43BMRQS` ID belongs to Drift and must not be used here.
The Property ID is not the stream ID (`16207676446`).

`src/data/analyticsConfig.js` holds the public Measurement ID. Empty disables the
integration and consent prompt. Never put a reporting key in this configuration.

The browser loads Google’s tag only after accepting optional analytics. Rejecting
does not contact Google. Preferences last up to 180 days; the footer can reopen
them. Withdrawing disables future hits and clears accessible GA cookies, without
claiming to erase previously collected data. DNT/GPC and non-production hosts
disable tracking. Existing Potluck product events are separate and unchanged.

Keep **Enhanced measurement OFF** on this Web stream: page views and named
actions are sent manually. This prevents duplicate History API page views and
automatic form/outbound events. No changes are needed to existing app streams.
Google signals and advertising features are disabled in the tag configuration.

Events: `page_view`, `app_store_click`, `save_to_savor`, `pinterest_save`,
`recipe_open` (recipe/article links), `series_filter`, `tool_use` (form changes),
`potluck_spin` (successful results), and `file_download` (PDF link clicks).
Clicks do not prove installation, saving or completed downloads. Parameter values
are allowlisted; typed contents, account identifiers and URL query strings are
not sent by this integration. Referrers are reduced to their origin. Query-based
campaign attribution is consequently not preserved by our manual page events.

Admin reads aggregate reports server-side using its existing reporting account
with Viewer access and the Analytics Data API. It filters to getsavor.recipes
hostnames so app traffic is excluded. It reports the seven completed days ending
yesterday in the property timezone; allow 24–48 hours for reporting to settle.

Verify: `node --test scripts/website-analytics.test.mjs`, `npm run build`, and
`node scripts/validate-website-analytics-browser.mjs`. The browser check intercepts
all requests and stubs Google’s tag; it never sends synthetic production hits.
