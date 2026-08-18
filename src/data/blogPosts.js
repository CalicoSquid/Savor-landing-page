// src/data/blogPosts.js
// Shared by the blog index, SEO route registry, structured data and sitemap.
// Add a new
// post here first — everything else reads from this list, so nothing drifts
// out of sync across files the way title/description could if each script
// kept its own copy.
//
// `title` and `dek` are the on-page headline and standfirst — written to
// read well in the article. `metaTitle` and `metaDesc` are the optional
// search-results versions, used when the on-page copy would overrun
// Google's ~60-char title / ~160-char description limits and get truncated
// mid-sentence. prerender.js falls back to title/dek where these are absent.

export const BLOG_POSTS = [
  {
    slug: 'save-recipes-from-websites',
    title: 'How to Save Recipes From Websites Without Losing Them',
    dek: 'Bookmarks, screenshots and open tabs all work — until they don’t. Here’s a simple way to keep online recipes findable, cookable and connected to the original source.',
    metaTitle: 'How to Save Recipes From Websites | Savor',
    metaDesc: 'Learn how to save recipes from websites so they stay searchable, cookable and linked to the original source — without relying on bookmarks or screenshots.',
    date: '2026-08-18',
    readTime: '6 min read',
    ogImage: 'https://getsavor.recipes/images/savor-og.jpg',
    ogImageAlt: 'Savor Blog — How to save recipes from websites without losing them',
    author: 'Caleb',
  },
  {
    slug: 'how-to-scale-a-recipe',
    title: 'How to Scale a Recipe Up or Down Without Wrecking It',
    dek: 'Recipe maths is easy. Pans, salt, heat and baking are where it goes wrong. A chef’s guide to doubling, halving and feeding the number of people actually coming.',
    metaTitle: 'How to Scale a Recipe Up or Down | Savor',
    metaDesc: 'A chef’s guide to scaling recipes up or down: the basic formula, what not to multiply blindly, pan sizes, cooking times, baking and awkward fractions.',
    date: '2026-08-18',
    readTime: '7 min read',
    ogImage: 'https://getsavor.recipes/images/savor-og.jpg',
    ogImageAlt: 'Savor Blog — How to scale a recipe up or down without wrecking it',
    author: 'Caleb',
  },
  {
    slug: 'save-handwritten-recipe-cards',
    title: 'How to Save Handwritten Recipe Cards Before They\u2019re Gone',
    dek: 'A real preservation checklist for the recipe cards, cookbook margins, and torn-out clippings that only exist in one copy \u2014 on paper, in someone\u2019s handwriting.',
    metaTitle: 'How to Save Handwritten Recipe Cards | Savor',
    metaDesc: 'A preservation checklist for recipe cards, cookbook margins and torn-out clippings that exist in only one copy \u2014 on paper, in someone\u2019s handwriting.',
    date: '2026-06-30',
    readTime: '7 min read',
    ogImage: 'https://getsavor.recipes/blog/save-handwritten-recipe-cards-og.jpg',
    ogImageAlt: 'Savor Blog — How to save handwritten recipe cards before they are gone',
    author: 'Caleb',
  },
  {
    slug: 'life-story-before-the-recipe',
    title: 'Why Does Every Recipe Online Come With a Life Story? (And How to Skip It)',
    dek: 'There\u2019s a reason almost every recipe site makes you scroll past a memoir before you reach the ingredients. It\u2019s not laziness \u2014 it\u2019s timing. Here\u2019s the actual reason, and the fastest way through it.',
    metaTitle: 'Why Recipes Come With a Life Story | Savor Blog',
    metaDesc: 'Why almost every recipe site makes you scroll past a memoir before the ingredients \u2014 the actual reason it happens, and the fastest way past it.',
    date: '2026-07-10',
    readTime: '5 min read',
    ogImage: 'https://getsavor.recipes/blog/life-story-before-the-recipe-og.jpg',
    ogImageAlt: 'Savor Blog — Why online recipes come with a life story',
    author: 'Caleb',
  },
]
