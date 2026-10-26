# Shared recipe collection duplicates

The website build fetches eligible public-link recipes from `sitemapRecipes`.
Kitchen originals, Community snapshots, saved copies and independently entered
copies can all appear as separate eligible IDs.

`scripts/lib/deduplicate-recipes.mjs` selects one listing when the title,
ingredients, ordered instructions, servings, ingredient groups and cooking times
match. Whitespace is normalized; ingredient case and quantities are preserved.
Recipes missing ingredients or instructions are never grouped by title alone.
Photos and descriptions do not distinguish otherwise identical recipes.

Selection prefers a published Community snapshot, then a non-saved copy, then
the oldest ID as a deterministic tie-breaker. Only already-eligible candidates
are considered. The build does not discover or expose private linkage fields.

The resulting manifest feeds both `/recipes/` and the sitemap. Existing `/r/:id`
URLs remain available; this does not delete app records, redirect shared links
or change their individual canonical metadata. Content variants remain separate.

Verify with `node --test scripts/deduplicate-recipes.test.mjs` and `npm run build`.
