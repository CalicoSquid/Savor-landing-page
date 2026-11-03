# Substitution finder expansion

Implemented on 3 November 2026. Production deployment authorized after local validation; deployment preview and live checks are required before sign-off.

- Increased coverage from 21 to 40 ingredients, with 54 usage contexts and 85 swap options.
- Added flour and sugar variants, cocoa, unsweetened chocolate, vanilla, yogurt, crème fraîche, cream cheese, evaporated milk, canned coconut milk, breadcrumbs, tomato paste, stock, fish sauce, ginger, onion and mayonnaise.
- Added category browsing, consistent accent/regional-name normalization, explicit spelling suggestions, Enter-to-select and focus on the selected result. An unknown ingredient clears the old result rather than leaving unrelated advice visible.
- Added 11 measured swaps. Quantities scale from structured ingredient components; preparation times, qualifications and warnings remain unchanged. Milk in an acidified-buttermilk mixture is correctly shown as a fill-to-total amount.
- Each option can be copied with its usage, expected changes and cautions. Invalid scaled amounts disable copying. Context and ingredient changes reset the amount.
- Added reference links for relevant entries and general extension references. Corrected the self-rising flour wording to identify the US-style mix and regional salt differences.
- Updated description and structured data to match the expanded functionality; retained the existing URL and title.

Sources include university extension tables, King Arthur flour/sugar/cocoa guidance, Nielsen-Massey vanilla equivalence and the Land O’Lakes ingredient reference. These are curated practical starting points, not claims that all options have been physically tested in every recipe. Where a reliable universal ratio is unavailable, the tool offers incremental adjustment or recommends a recipe designed for that ingredient.

Verification: production build and SEO pipeline passed, targeted ESLint passed, and regression checks cover aliases/accents, typo handling, quantity scaling, preserved preparation instructions and complete entry structure. Browser checks rendered all 40 ingredients and exercised category browsing, keyboard selection/focus, scaling/reset, copied cautions, empty/invalid states and 1440/390/320 px layouts without page errors or horizontal overflow.

Local preview: http://127.0.0.1:4183/tools/ingredient-substitutions/
