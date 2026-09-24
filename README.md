# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Savor-backed kitchen conversion data

`/tools/measurement-converter/` uses the public read-only conversion corpus served by the Savor recipe API at `/kitchen-conversions` instead of maintaining a second ingredient-density table in this repo. The browser caches the last valid payload in local storage and refreshes it from the API on page load. Direct unit and temperature conversions remain local; ingredient-aware cup/weight conversion waits for the shared Savor dataset.

`/tools/pan-converter/` compares round, square and rectangular baking-pan surface area, calculates the batter multiplier needed to preserve approximate depth, shows the unscaled depth change, and can feed that multiplier into the shared recipe-scaling parser. Loaf and sheet-pan presets are explicitly marked as approximate because footprint alone does not capture sloped sides or pan depth.

Set `VITE_SAVOR_API_BASE` to override the API host. If only `VITE_APOLLO_URI` is set, the converter derives the API host by removing the trailing `/graphql`.

`/tools/portion-planner/` adds a chef-style crowd calculator for pasta, rice, potatoes, meat, fish, vegetables, salad, bread, soup, sauce and cheese. It adjusts a practical adult portion for children, serving style, appetite and leftovers, then displays a rounded shopping target in metric or US units. The planning assumptions live in `src/lib/portionPlanner.js` so they remain testable and easy to tune as real usage/Search Console data arrives.


### Ingredient Substitution Finder

`/tools/ingredient-substitutions/` adds a context-aware substitution guide for common baking and cooking ingredients. The curated data lives in `src/lib/substitutionFinder.js`, with search aliases, use-case contexts, practical ratios, expected changes and technique-specific warnings. It deliberately avoids presenting substitutions as chemically identical ingredients; the UI explains what each swap is good for and when it is a poor fit.

### Fermentation Brine Calculator

`/tools/brine-calculator/` keeps two common percentage conventions visibly separate: total-weight fermentation salt uses vegetables + added water as the base, while water-only brine uses only the water weight. The pure calculation logic lives in `src/lib/brineCalculator.js`, supports metric and US input/display, and deliberately does not claim that a percentage alone makes a preservation process safe. The page points users to tested preservation guidance and encourages weighing salt rather than relying on spoon volume.


## Kitchen tools: baker's percentage calculator

`/tools/bakers-percentage/` calculates true dough hydration and baker's percentages by weight, including the flour and water inside a starter/preferment. It can scale the current formula to a target number and weight of loaves or dough balls. Core maths lives in `src/lib/bakersPercentage.js` and is covered by `scripts/validate-tools.mjs`.

## Kitchen tools SEO / discovery pass — 2026-09-24

The Kitchen Tools cluster now uses `src/data/toolPages.js` as the shared catalog for the `/tools/` hub, related-tool modules and the structured-data `ItemList`. The homepage links directly into the tools cluster, and the recipe-scaling article includes contextual links to the scaler, pan converter, measurement converter and portion planner.

Each tool keeps its existing `WebApplication` + breadcrumb structured data. Promotional app CTAs are marked with `data-nosnippet` so search snippets can focus on the calculator/explainer content. Significant route changes have accurate `lastmod: 2026-09-24` values for sitemap generation. `scripts/validate-seo.mjs` now checks homepage/hub discovery, tool backlinks, related-tool links and the snippet-exclusion marker after prerendering.

Do not add FAQ structured data solely for search appearance: Google removed FAQ rich-result support in 2026. Keep useful question/answer copy visible on the page when it genuinely helps users.

## Potluck search/discovery pass — 2026-09-24

Potluck is now part of the shared `TOOL_PAGES` catalog as the eighth Kitchen Tool while keeping its canonical route at `/potluck/`. The page leads with the literal search intent (`Random Dinner Generator — What Should I Cook Tonight?`) while preserving the Potluck voice and playable wheel. Supporting copy explains the useful distinction between a random food-name picker and Potluck returning a real cookable recipe.

`/blog/what-should-i-cook-tonight/` is the supporting search article. It gives a practical dinner-decision framework and links naturally into Potluck rather than existing as a thin keyword page. Potluck links back to the article, `/tools/`, the portion planner, ingredient substitutions and recipe scaler. The homepage Kitchen Tools section now features Potluck directly, and `/tools/` structured data automatically includes all eight tools.

No filtering or meal-planning behaviour was added to Potluck in this pass; those remain product decisions for the app/web experience rather than SEO-only features.
