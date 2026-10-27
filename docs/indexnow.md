# Conservative IndexNow integration

This is notification infrastructure only. Existing pages, SEO definitions,
recipe selection, sitemap generation, robots.txt, redirects, images and UI are
unchanged. There is no client-side tracking or submission code.

## Verification

The supplied public key is committed as
`public/83438594cc1a4361a467018f4214fb5c.txt`, containing exactly the matching key.
Vite copies it into `dist/` on every build. An exact-path Netlify header serves
it as `text/plain; charset=utf-8`. The existing SPA rewrite applies only to
`/r/*`, so the root verification file is not intercepted.

Production verification URL:
https://getsavor.recipes/83438594cc1a4361a467018f4214fb5c.txt

The key is intentionally public; no secret key environment variable is needed.
Submissions use only `https://api.indexnow.org/indexnow`, with `host`, `key`,
`keyLocation` and `urlList` in the documented JSON POST body.

## Eligibility and changes

- Static pages must already be canonical, indexable and included by the existing
  `SEO_PAGES`/XML sitemap policy. This includes published articles, Originals and
  recipe hubs, cooking tools, Potluck and other public pages.
- `/demo` is excluded from notifications as an experimental/demo page. Its
  existing indexing and sitemap behavior are not changed.
- Recipe URLs must already be selected by the existing deduplicated public
  recipe SEO manifest, have no source URL, **and** be community-published
  (`isShared === true`). Private/personal bearer-link originals, imports and
  duplicate copies are not submitted. The existing sitemap includes some
  link-circulated non-community originals; that policy is left untouched.
- Noindex/legal, admin/authentication, staging/preview, user-specific and
  noncanonical URLs are excluded. Input URLs must belong to getsavor.recipes.
- Previously eligible URLs can be notified as removed only after their live URL
  returns 404/410 or permanently redirects to a same-host canonical indexable
  page. A missing sitemap entry alone never proves deletion.

`prepare-seo-data.mjs` writes an optional ignored fingerprint sidecar from its
already-selected recipes. This does not alter its existing output or indexing
decisions. The fingerprint includes actual recipe text, ingredients, steps,
servings, times and image URL; it excludes `updatedAt` and linkage metadata.

After the existing build and SEO checks, `generate-indexnow-manifest.mjs` adds
`dist/indexnow-manifest.json`. Static fingerprints include rendered main-content
text, content links/images and relevant SEO text. They exclude global navigation,
footer, scripts/styles, deployment timestamps and modification dates. The
manifest exposes only existing eligible public URLs and content hashes, plus
the build context and deployment ID. It has a new-file-only noindex header.

The first production run establishes a baseline and submits **zero** historical
URLs. Later runs compare fingerprints against the last acknowledged state,
classifying additions, content updates and removals. Unchanged builds submit
nothing. Missing/incomplete manifest generation disables notifications for
that deployment rather than inferring deletions or breaking the build.

For meaningful JavaScript-only tool changes or replacement image bytes at an
unchanged URL, explicitly add/update a per-URL revision in
`indexnow-revisions.json`, for example:

```json
{
  "https://getsavor.recipes/tools/measurement-converter/": {
    "revision": "ingredient-density-correction-v1",
    "reason": "Corrected conversion behavior without changing rendered copy"
  }
}
```

Only URLs already eligible for notification are used. Do not bump revisions for
builds, timestamps, formatting, analytics or unrelated code changes.

## Production event handling and state

`netlify/functions/indexnow.mjs` subscribes to Netlify's signed `deploySucceeded`
event. It also subscribes to `deployUnlocked` to support our existing workflow:
pin production, validate the unpublished build, publish it, then unlock it.
Both events share one worker and ledger; there is no separate notification hook.

The worker requires `INDEXNOW_ENABLED=true`, the correct site ID/production
origin, a published ready production event and a live manifest whose deployment
ID matches the event. It verifies the public key file and rechecks changed URLs
as a search crawler before submitting. It checks the live deployment ID again
before sending a batch. Local builds, previews, unpublished deploys and stale
events do not submit.

The native Netlify Blobs store `savor-indexnow` holds only the last acknowledged
fingerprints and a conditional-write lock. It needs no separately provisioned
service or database. Strong reads, atomic lock acquisition and an expiring lease
prevent ordinary overlapping hooks from duplicating submissions. Successful
200/202 batches advance the ledger; failures remain pending for a later
production event. A crash between remote acceptance and saving the ledger can
still cause a duplicate on retry; exactly-once delivery is not claimed.

The HTTP helper uses native fetch, 100-URL batches (protocol maximum 10,000),
4-second timeouts and at most two retries for network errors, 429 and 5xx.
200 means received; 202 means received with key validation pending. 400/403/422
are logged and not retried. Long Retry-After values stop immediate retries.
Per-event verification work is bounded to 100 candidates/20 seconds, leaving
any backlog for a later event. There are no scheduled jobs. Notification errors
are caught and cannot fail the already-completed website deployment.

## Configuration and verification

Set `INDEXNOW_ENABLED=true` for the **production** Netlify deploy context only,
with Functions scope (or all scopes on a Free plan). Leave it absent/false in
other contexts. `URL` and `SITE_ID` are provided by Netlify at function runtime;
`CONTEXT` and `DEPLOY_ID` are embedded in the manifest at build time. No personal
Netlify API token is needed in the deployed function. `@netlify/blobs` is the
only added dependency; all pre-existing dependency versions are preserved.

Run:

```text
npm run test:indexnow
npm run build
npm run indexnow:dry-run -- -
npm run indexnow:dry-run -- previous-manifest.json dist/indexnow-manifest.json
```

The dry-run tool is offline and has no send option. `-` establishes a baseline
and displays an empty submission list; supplying a prior manifest shows the
exact changed canonical URLs. Tests use injected HTTP/storage and never call
the live IndexNow API. No historical flood or artificial live submission is
needed to test this integration.

After a real content publication, inspect Netlify's `indexnow` function logs
for baseline/unchanged/changed counts and response status. In Bing Webmaster
Tools select getsavor.recipes, open **IndexNow**, then **IndexNow Insights** /
**Submitted URLs** and inspect the submitted URL's crawl/index status. An empty
initial report is expected: initialization sends nothing. Acceptance is not a
guarantee of crawling, indexing, rankings or Copilot inclusion.

## Deliberate limitations

- Recipe changes are detected when the website next deploys. There is no new
  backend webhook. Immediate publishing/edit/delete notifications would need
  a separate, explicitly scoped integration after the Savor API successfully
  commits public original snapshot changes. That backend is not modified here.
- Runtime-only content/feed changes and JavaScript-only behavior changes do not
  trigger notifications automatically; publish a website snapshot or use a
  reviewed per-URL revision where appropriate.
- A manual publish that stays locked produces no supported production event
  here; unlock the newly published deploy to run the same guarded worker.
- If notifications fail and no later production event occurs, there is no
  automatic scheduled retry. The XML sitemap remains available as before.

References: [IndexNow protocol](https://www.indexnow.org/documentation),
[Netlify event functions](https://docs.netlify.com/build/functions/trigger-on-events/),
[Netlify Blobs](https://docs.netlify.com/build/data-and-storage/netlify-blobs/),
[Bing IndexNow reports](https://www.bing.com/webmasters/help/indexnow-0z209wby).
