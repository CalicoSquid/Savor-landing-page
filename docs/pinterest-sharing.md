# Pinterest recipe sharing

Authored Pin copy lives in `src/data/pinterest.js`. Add a title (up to 100
characters), description (up to 500) and visual alt text when adding an Original.
Write factual recipe descriptions with useful ingredients, timing and method;
alt text describes what is actually pictured. Retain external recipe/photo
credits, including Iron Kitchen’s smash-burger image and adaptation credit.

`PinterestSave` keeps the direct Save link and offers an optional **Pin text**
disclosure with copy buttons. The Save endpoint supports `url`, `media` and
`description`; it has no documented title/alt-text parameters. Do not claim
those fields are automatically populated. Readers can paste the suggested
title/alt into Pinterest’s editor. The website’s OG title/description, Recipe
name, image alt and `data-pin-*` attributes supply relevant source metadata.
Pinterest controls the final composer and Rich Pin presentation.

Shared recipe pages use the same component with a conservative fallback from
known recipe fields, timing and servings. The description preserves original
publisher and photo credits within the 500-character limit. Missing or failed
images omit `media` so Pinterest can select images from the page. No Pinterest
JavaScript is loaded on the site, and no Pins are created automatically.

New code affects future Save actions and the page metadata; it does not directly
edit existing Pins or guarantee when Pinterest refreshes cached metadata.

References: [Save button](https://developer.pinterest.com/docs/web-features/buttons/),
[Recipe Pins](https://developer.pinterest.com/docs/web-features/recipe-rich-pins/),
[Pin alt text](https://help.pinterest.com/en-gb/node/2461).

Checks: `npm run build` includes Pin-copy/URL tests and SEO/edge validations.
`node scripts/validate-pinterest-browser.mjs` verifies the five Originals,
copy controls, mobile layouts, shared recipe fallback and failed media. It does
not log in to Pinterest or create Pins.
