# Recipes from videos

`/shorts/` is the permanent bio-link page. It links to existing shared Savor
recipes, without connecting Studio to the recipe database.

Add featured posts to `src/data/shorts.js`, using the example in that file.
Give each post a unique ID, a recipe title, an existing HTTPS `/r/{id}` recipe
URL, and a featured date (`featuredAt`, `YYYY-MM-DD`). The image and published video URL
are optional. Use a recipe photo or a recognizable video still; local images
go in `public/images/`. Posts display newest first.

In Studio's Publish screen, paste the shared recipe into **Recipe link** and
save the publishing copy. Use **Open recipe** to check it and **Copy recipe
link** when preparing the featured entry. Other Studio users can use any HTTPS
recipe URL or leave the field empty.

The featured list is curated manually and requires a site rebuild/deployment.
Connecting an account or posting a Reel does not automatically feature it.
Studio adds the recipe URL and a link-in-bio reminder to the published/copied
caption. This does not update the featured list or your platform profile links.

No sample recipes or unpublished videos are presented as real posts. Until the
first entry is supplied, the page shows a short introduction and Instagram link.
