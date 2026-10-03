# Recipes from videos

`/shorts/` links to existing shared Savor recipes. The recipe database is not connected or changed.

Admins can open **Studio > Settings > Manage /shorts** and choose **Add recipe** or **Edit**. Enter the recipe title, shared Savor `/r/{id}` URL, and published YouTube/Instagram/TikTok URL. An HTTPS image URL is optional. Posted date controls newest-first order. **Save to /shorts** updates the public list without rebuilding the website. **Remove** followed by **Confirm removal** removes a featured entry, not the recipe or social post.

Other Studio users do not see this editor. The server rejects non-admin reads and writes to `/api/admin/shorts`; browser roles cannot grant access. The public read-only feed exposes only featured entries at `/api/public/shorts`. Netlify proxies `/api/shorts` to it. Studio stores this list separately in its existing metadata store, with revision checks to prevent lost edits.

The current doughnut recipe is the initial entry. `src/data/shorts.js` provides the build-time/failure fallback. Normal live updates come from the feed, including an intentionally empty list. If the feed is temporarily unavailable, the website retains its bundled fallback. Publishing a social post does not automatically feature it; add the returned video URL after posting.
