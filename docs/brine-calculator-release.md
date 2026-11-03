# Brine calculator: implementation and search baseline

3 November 2026. Existing URL retained: https://getsavor.recipes/tools/brine-calculator/ .

## User workflows

- Meat & poultry: wet brining by water weight; dry brining by meat weight.
- Vegetable fermentation: total vegetable-plus-water weight, or water only; zero added water supports dry-salted vegetables in total-weight mode.
- Salt concentration: salt-to-water ratio, or salt as a percentage of the final water-and-salt solution. These are distinct denominators. At 5% with 1000 g water, the results are 50 g and approximately 52.63 g respectively.

Every method keeps independent inputs. Values are stored in grams and displayed in g/kg/oz/lb or ml/L/US fl oz/US cups without recalculating from rounded displays. Missing, negative, overflowing and out-of-range inputs show an explanation. Percentage examples demonstrate arithmetic and are not recipe recommendations. Wet brining needs water, not an irrelevant meat-weight field. Dry brining excludes water.

Results can be copied with their inputs, method and percentage denominator. No curing-salt, equilibrium-time or preservation-safety claims are made. Relevant USDA, University of Wyoming Extension and NCHFP guidance is linked. Application promotional copy describes saving a recipe rather than implying every new web calculator mode exists in the mobile app.

## Search baseline: connected Search Console, read on 3 November

Final web-search data for 3–31 October 2026, filtered to this exact canonical URL:

| Metric / query | Impressions | Clicks | Average position |
| --- | ---: | ---: | ---: |
| Page aggregate | 388 | 0 | 11.24 |
| brine concentration calculator | 138 | 0 | 3.81 |
| brine calculator | 16 | 0 | 24.81 |

Query rows are not an exhaustive breakdown: Search Console can omit anonymized queries and aggregates differ by grouping. This is a baseline, not a causal attribution of zero clicks to metadata. Concentration calculations were added because the strongest visible query deserves a matching tool, not just a matching title.

URL Inspection before the update returned **PASS / Submitted and indexed**, successful mobile fetch, allowed crawling/indexing, and matching Google/user canonicals. Last crawl: 1 November 2026 at 08:45:23 UTC. The sitemap was already known to Google.

## Metadata and crawl handling

- Retain route and canonical; no redirect or split into competing landing pages.
- Align the title, description, social tags, tool-directory card, H1/lead and WebApplication structured data with the implemented scope.
- Keep explanations for all calculation methods in server-rendered HTML, including an explicit brine-concentration example.
- Update the brine sitemap `lastmod` to 2026-11-03 for this substantive change. No artificial dates on unrelated pages.
- Existing IndexNow infrastructure may notify participating engines on deployment. IndexNow is not a Google recrawl request.

The connected Google service account has Restricted/read-only access. URL Inspection can read Google's indexed state; it cannot request a live recrawl through that API. No unsupported Google Indexing API request or obsolete sitemap ping is used.

After publication, an owner/full user can open Search Console for `sc-domain:getsavor.recipes`, inspect the existing canonical URL, test the live URL and select **Request indexing** once. Repeated requests do not speed crawling. Keep the known sitemap submitted.

Google decides when to recrawl and may choose page text instead of the meta description. Deployment/notification does not establish that the new text has been indexed or guarantee a particular search snippet. Review CTR and position for the same query/device/country segments after Google has recrawled, rather than treating a change in blended CTR as proof of success.

References: [Google snippets](https://developers.google.com/search/docs/appearance/snippet), [Google recrawl requests](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

## Verification

- Regression tests cover all six denominators, unit preservation, blank/invalid inputs, overflow, small salt weights, copied precision and consistent SEO scope.
- Production build validates prerendered metadata, sitemap, robots and recipe edge behavior.
- Browser checks cover all six modes at 1440, 390 and 320 px, saved input isolation, pound conversions, copy output, keyboard activation, empty/error states, social/canonical tags and sitemap modification date.
- Preview and live deployment checks use the same calculator scenarios. Indexing acceptance is separately assessed via Search Console; it is not inferred from browser success.
