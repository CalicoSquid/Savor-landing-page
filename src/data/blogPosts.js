// src/data/blogPosts.js
// Shared by the blog index page (rendering), prerender.js (meta tags +
// BlogPosting schema), and generate-sitemap.js (sitemap entries). Add a new
// post here first — everything else reads from this list, so nothing drifts
// out of sync across files the way title/description could if each script
// kept its own copy.

export const BLOG_POSTS = [
  {
    slug: 'save-handwritten-recipe-cards',
    title: 'How to Save Handwritten Recipe Cards Before They\u2019re Gone',
    dek: 'A real preservation checklist for the recipe cards, cookbook margins, and torn-out clippings that only exist in one copy \u2014 on paper, in someone\u2019s handwriting.',
    date: '2026-06-30',
    readTime: '7 min read',
    ogImage: 'https://getsavor.recipes/screenshots/scan.webp',
  },
  {
    slug: 'life-story-before-the-recipe',
    title: 'Why Does Every Recipe Online Come With a Life Story? (And How to Skip It)',
    dek: 'There\u2019s a reason almost every recipe site makes you scroll past a memoir before you reach the ingredients. It\u2019s not laziness \u2014 it\u2019s timing. Here\u2019s the actual reason, and the fastest way through it.',
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