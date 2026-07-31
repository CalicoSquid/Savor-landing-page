// src/data/blogPosts.js
// Shared by the blog index page (rendering), prerender.js (meta tags +
// BlogPosting schema), and generate-sitemap.js (sitemap entries). Add a new
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
    slug: 'save-handwritten-recipe-cards',
    title: 'How to Save Handwritten Recipe Cards Before They\u2019re Gone',
    dek: 'A real preservation checklist for the recipe cards, cookbook margins, and torn-out clippings that only exist in one copy \u2014 on paper, in someone\u2019s handwriting.',
    metaTitle: 'How to Save Handwritten Recipe Cards | Savor',
    metaDesc: 'A preservation checklist for recipe cards, cookbook margins and torn-out clippings that exist in only one copy \u2014 on paper, in someone\u2019s handwriting.',
    date: '2026-06-30',
    readTime: '7 min read',
    ogImage: 'https://getsavor.recipes/screenshots/scan.webp',
  },
  {
    slug: 'life-story-before-the-recipe',
    title: 'Why Does Every Recipe Online Come With a Life Story? (And How to Skip It)',
    dek: 'There\u2019s a reason almost every recipe site makes you scroll past a memoir before you reach the ingredients. It\u2019s not laziness \u2014 it\u2019s timing. Here\u2019s the actual reason, and the fastest way through it.',
    metaTitle: 'Why Recipes Come With a Life Story | Savor Blog',
    metaDesc: 'Why almost every recipe site makes you scroll past a memoir before the ingredients \u2014 the actual reason it happens, and the fastest way past it.',
    date: '2026-07-10',
    readTime: '5 min read',
    ogImage: 'https://getsavor.recipes/screenshots/found.webp',
  },
]

export function blogPostSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.dek,
    image: post.ogImage,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: 'Caleb',
      url: 'https://getsavor.recipes/about',
    },
    publisher: { '@id': 'https://getsavor.recipes/#org' },
    mainEntityOfPage: `https://getsavor.recipes/blog/${post.slug}`,
  }
}