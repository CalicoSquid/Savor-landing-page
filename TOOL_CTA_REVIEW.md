# Tool-to-app CTA review ? 9 October 2026

Implemented and reviewed before deployment. Adapted the existing `ToolAppCta` rather than adding a second install block. Six tool pages keep their existing CTA placement after the calculator, explanation and related tools.

## Exact copy

### /tools/portion-planner/

**Keep this portion calculator in your pocket**

Plan portions in Savor alongside your saved recipes and other kitchen tools.

Action: **Get Savor**.

### /tools/measurement-converter/

**Convert measurements while you cook**

Convert cooking measurements, including ingredient-specific cups to grams, alongside your recipes in Savor.

Action: **Get Savor**.

### /tools/pan-converter/

**Resize the pan — and the recipe**

Compare pan sizes in Savor and apply the multiplier to your recipe’s ingredients for this cook. Your saved recipe stays unchanged.

Action: **Get Savor**.

### /tools/brine-calculator/

**Keep your brine calculator in Savor**

Calculate salt by water weight or food and water weight, alongside your recipes and other kitchen tools.

Action: **Get Savor**.

### /tools/bakers-percentage/

**Check dough hydration in Savor**

Calculate dough hydration, including the flour and water in your starter, alongside your saved recipes.

Action: **Get Savor**.

### /tools/recipe-scaler/

**Scale the recipe where you saved it**

Save a recipe in Savor and scale its ingredients whenever you cook it — no copying values into a separate calculator.

Action: **Get Savor**.

## Links and measurement

All six actions use the existing Google Play destination for `com.calicosquid.savorrecipes`, with a Play referrer containing `utm_source=savor_web`, `utm_medium=tool_cta`, `utm_campaign=kitchen_tools` and a per-tool `utm_content`. Store attribution does not establish an installation or guarantee that the app records the referrer. Existing Savor deep links cover recipes, browsing and collaborations, but not individual tool routes. Tool deep links would require separate app routing work. No new app release is included.

There is no general website analytics integration. The existing Potluck-only endpoint rejects other events, so no tool_app_cta_click event was added and no analytics dependency or backend change was introduced. Adding reliable tool click reporting is separate work.

## Verification and boundaries

- Full build passed: calculator validation, client/SSR builds, prerender, SEO and recipe-edge checks.
- Targeted ESLint passed for all changed page/component code.
- Chromium verified all six pages at 360px and 1280px: a single tool CTA after the form, correct store/referrer links and no horizontal overflow. Mobile pan CTA visually reviewed.
- Titles, H1s, meta tags, canonicals and JSON-LD matched live production on all six pages before deployment.
- Production JavaScript increased by 547 bytes gzipped, approximately 0.55 KB. No dependency, image, font or request-on-load was added. This is a bundle-size check, not a full performance benchmark.
- Calculator source logic, routes, schema, indexing and metadata remain unchanged. Ingredient substitutions retain generic recipe-app copy without promising substitutions in the app. Dough copy promises hydration, not full baker percentages/batch sizing.
- Existing baseline issue: revisiting Measurement Converter with cached data reports React hydration error 418 on both current live production and the candidate build. Browser layouts and CTA links work; this pre-existing cache/SSR mismatch was left outside the conversion-only change.

## Follow-up review

No task scheduler was available, so the requested automatic two-hour follow-up could not be created. If reviewing later, confirm the deployed bundle/CTA copy, mobile layouts and Play attribution, and consider the existing converter cache hydration issue and a proper tool analytics endpoint separately.
