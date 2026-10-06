# Replace a website recipe photo

This changes only the website. App and Community photos remain independent.

1. Copy the recipe ID from its existing `https://getsavor.recipes/r/ID` link.
2. Put the replacement image in `public/images/recipes/` (create the directory
   if needed), using a new filename for each replacement to avoid stale caches.
   Alternatively, use a publicly accessible HTTPS image URL.
3. Add an entry to `src/data/recipeImageOverrides.js`:

   ```js
   'ID': {
     image: '/images/recipes/buffalo-pasta-v2.webp',
     imageCredit: null,
   },
   ```

   For a photo requiring attribution, set `imageCredit` to
   `{ photographer: 'Name', photographerUrl: 'https://...' }`.
4. Commit and push to deploy. Check the existing recipe URL once deployment
   finishes. Crawler responses can stay cached for an hour, and social services
   have their own caches.

The override covers the recipe hero, Pinterest Save image, Open Graph/Twitter
previews, Recipe JSON-LD and the build-time recipe listing. It keeps the same
recipe URL. Remove the entry and redeploy to restore the API image.

Published Pinterest Pin images cannot be replaced this way; new Pins can use
the replacement photo.

An entry can also include `ingredientGroups`, for example:
`[{ label: 'Crust', startIndex: 0 }, { label: 'Filling', startIndex: 3 }]`.
Indices refer to the unchanged API ingredient list, starting at zero. Check the
boundaries again if that recipe's ingredient list changes. Headings appear on
the website and in search crawler HTML; Recipe JSON-LD keeps the flat ingredient
list that recipe consumers expect.
