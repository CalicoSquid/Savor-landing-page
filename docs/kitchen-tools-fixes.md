# Kitchen tools fix scaffold

Status: calculation fixes published on 3 November 2026. The brine UI, canonical-weight state and metadata integration are now implemented; see `brine-calculator-release.md` for validation and indexing status.

## Implemented in this scaffold

- Regression suite: `scripts/kitchen-tools-regressions.test.mjs`.
- Recipe temperatures retain one decimal place instead of rounding to multiples of five. Temperature line conversions are counted separately from ingredient conversions.
- Recipe scaling recognizes grouped thousands and numbered list prefixes. Metric weights/volumes use decimals. Ambiguous decimal-comma input stays unchanged with a review flag.
- Small positive conversion results retain significant digits.
- Conversion UI flags compound amounts, bracketed equivalents and numbered lists for review.
- Fermentation brine rejects invalid weights, unknown methods and percentages outside the UI's 0.1–20 range. Tiny salt values retain precision. Unit switching retains conversion precision and does not normalize invalid weights.
- Dough formulas reject negative/non-finite ingredients; batch scaling rejects fractional piece counts.
- Separate meat-brining calculation contract and tests, connected to the brine page with independent wet and dry workflows.

## Meat-brining integration

`src/lib/meatBrineCalculator.js` deliberately requires a recipe percentage. There are no recommended percentage presets or timing estimates.

| Method | Salt calculation | Input rules |
| --- | --- | --- |
| Wet | added water weight × percentage / 100 | Positive meat and water weights; denominator excludes meat and salt |
| Dry | meat weight × percentage / 100 | Positive meat weight; no added water |

These percentages are ingredient-weight ratios, not final-solution salinity. The 0.1–20 input range is a numerical guard, not a food-safety recommendation. Equilibrium brining, curing salts, injection, timing and preservation are outside this contract.

Remaining implementation:

- [x] Add the meat / vegetable-fermentation choice to the existing brine route, with a deliberate initial selection.
- [x] Provide separate wet/dry controls and retain the current vegetable total-weight/water-only distinction.
- [x] Store canonical gram values independently from displayed unit text, including invalid/empty editing states.
- [x] Explain percentage denominators beside the inputs and results. Hide irrelevant inputs without silently reusing values from another method.
- [x] Add sourced refrigeration, handling, used-brine disposal and pre-salted meat guidance. Keep fermentation and canning limitations in their relevant workflow.
- [x] Add accessible result announcements and complete keyboard/mobile/clipboard checks.
- [x] Update title, description, H1, social tags, tool-directory card and WebApplication schema together with the integrated workflow.

Candidate title after integration: **Brine Calculator for Meat & Vegetable Fermentation | Savor**.

Candidate description: **Calculate salt for meat and poultry brining or vegetable fermentation. Choose your method, see the percentage basis, and get salt weights in grams or ounces.**

The final metadata also describes concentration calculations; the ranked route and canonical are unchanged.

Source references for the content pass:

- USDA poultry brining: https://ask.fsis.usda.gov/article/How-do-you-brine-poultry
- NCHFP fermentation: https://nchfp.uga.edu/how/ferment/general-information-on-fermenting/general-information-on-fermenting/
- Internal cooking temperatures: https://www.foodsafety.gov/food-safety-charts/safe-minimum-internal-temperatures

## Remaining review items

- [ ] Parse all amounts in compound ingredients rather than only flagging partial processing.
- [ ] Normalize bracketed equivalent quantities in converted lists, preserving package sizes.
- [ ] Reconcile the ingredient library's 240 ml cooking cup with the direct converter's 236.588 ml US cup, with explicit user-facing conventions.
- [ ] Audit extreme values, finite results, precision and invalid/empty states across all calculators.
- [ ] Independently validate substitution entries and portion estimates; complete accessibility and browser coverage.
- [ ] Inspect Search Console query/page/device/date data before attributing zero clicks to search intent.

## Validation

Run `npm run validate:tools` for the regression suite and existing kitchen-tool checks. Run `npm run build` for the production and SEO pipeline. Validate browser behavior locally and on the deployment URL before publishing, then verify the public site.
