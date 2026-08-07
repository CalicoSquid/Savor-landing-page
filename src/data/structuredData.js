import { FAQS } from './faqs.js'
import { BLOG_POSTS } from './blogPosts.js'
import { SITE_URL, PLAY_URL } from './seoPages.js'

const ORG_ID = `${SITE_URL}/#organisation`
const WEBSITE_ID = `${SITE_URL}/#website`
const SAVOR_APP_ID = `${SITE_URL}/#savor-app`
const AUTHOR_ID = `${SITE_URL}/about/#caleb`

export const baseEntities = [
  {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: 'CalicoSquid Code',
    alternateName: 'CalicoSquid',
    url: `${SITE_URL}/studio/`,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE_URL}/icons/icon-Tangerine.webp`,
      width: 160,
      height: 160,
    },
    founder: { '@id': AUTHOR_ID },
    sameAs: [
      'https://www.instagram.com/savor_recipeapp/',
      'https://uk.pinterest.com/cookincolor/',
    ],
  },
  {
    '@type': 'Person',
    '@id': AUTHOR_ID,
    name: 'Caleb',
    url: `${SITE_URL}/about/`,
    jobTitle: 'Independent software developer and former professional chef',
    worksFor: { '@id': ORG_ID },
  },
  {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    url: `${SITE_URL}/`,
    name: 'Savor',
    alternateName: 'Savor — Cook in Color',
    description: 'Official site for Savor, a recipe organiser for saving real recipes from websites, screenshots, cookbooks and handwritten cards.',
    publisher: { '@id': ORG_ID },
    inLanguage: 'en',
  },
]

export const savorApplication = {
  '@type': 'SoftwareApplication',
  '@id': SAVOR_APP_ID,
  name: 'Savor',
  alternateName: 'Savor — Cook in Color',
  applicationCategory: 'LifestyleApplication',
  applicationSubCategory: 'Recipe organiser',
  operatingSystem: 'Android',
  url: `${SITE_URL}/`,
  downloadUrl: PLAY_URL,
  installUrl: PLAY_URL,
  image: `${SITE_URL}/images/savor-og.jpg`,
  author: { '@id': AUTHOR_ID },
  publisher: { '@id': ORG_ID },
  description: 'Savor is a recipe organiser made by a former chef. Save recipes from websites, screenshots, cookbook pages and handwritten cards, then keep them as clean, cookable recipe cards.',
  featureList: [
    'Save and import recipes from websites',
    'Scan handwritten recipe cards and cookbook pages',
    'Turn screenshots and photos into structured recipe cards',
    'Turn roughly typed recipes into clean recipe cards',
    'Keep recipes in an ad-free personal collection',
    'Browse a calm, algorithm-free community recipe feed',
  ],
}

function breadcrumb(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

function webPageNode(seo, type = 'WebPage') {
  return {
    '@type': type,
    '@id': `${seo.canonical}#webpage`,
    url: seo.canonical,
    name: seo.title,
    description: seo.description,
    isPartOf: { '@id': WEBSITE_ID },
    about: seo.path === '/' ? { '@id': SAVOR_APP_ID } : undefined,
    inLanguage: 'en',
  }
}

function blogPostNode(post, seo) {
  return {
    '@type': 'BlogPosting',
    '@id': `${seo.canonical}#article`,
    headline: post.title,
    description: post.dek,
    image: {
      '@type': 'ImageObject',
      url: post.ogImage,
      width: 1200,
      height: 630,
    },
    datePublished: post.date,
    dateModified: post.modified || post.date,
    author: { '@id': AUTHOR_ID },
    publisher: { '@id': ORG_ID },
    mainEntityOfPage: { '@id': `${seo.canonical}#webpage` },
    isPartOf: { '@id': `${SITE_URL}/blog/#blog` },
    inLanguage: 'en',
  }
}

function appNode({ id, name, url, downloadUrl, description, image, price, priceCurrency = 'GBP' }) {
  const node = {
    '@type': 'SoftwareApplication',
    '@id': id,
    name,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Android',
    url,
    image,
    description,
    publisher: { '@id': ORG_ID },
  }
  if (downloadUrl) {
    node.downloadUrl = downloadUrl
    node.installUrl = downloadUrl
  }
  if (price != null) {
    node.offers = { '@type': 'Offer', price: String(price), priceCurrency }
  }
  return node
}

export function structuredDataForPage(seo) {
  if (!seo || seo.robots.startsWith('noindex')) return null

  const graph = [...baseEntities]

  if (seo.path === '/') {
    graph.push(savorApplication, webPageNode(seo))
  } else if (seo.path === '/about') {
    graph.push(savorApplication, webPageNode(seo, 'AboutPage'))
  } else if (seo.path === '/faq') {
    graph.push(
      savorApplication,
      {
        ...webPageNode(seo, 'FAQPage'),
        mainEntity: FAQS.map(({ q, a }) => ({
          '@type': 'Question',
          name: q,
          acceptedAnswer: { '@type': 'Answer', text: a },
        })),
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'FAQ', url: seo.canonical },
      ]),
    )
  } else if (seo.path === '/blog') {
    graph.push(
      {
        ...webPageNode(seo, 'CollectionPage'),
        mainEntity: { '@id': `${SITE_URL}/blog/#blog` },
      },
      {
        '@type': 'Blog',
        '@id': `${SITE_URL}/blog/#blog`,
        url: `${SITE_URL}/blog/`,
        name: 'Savor Blog',
        description: seo.description,
        publisher: { '@id': ORG_ID },
        blogPost: BLOG_POSTS.map((post) => ({ '@id': `${SITE_URL}/blog/${post.slug}/#article` })),
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Blog', url: seo.canonical },
      ]),
    )
  } else if (seo.path.startsWith('/blog/')) {
    const post = BLOG_POSTS.find((item) => `/blog/${item.slug}` === seo.path)
    if (post) {
      graph.push(
        webPageNode(seo, 'WebPage'),
        blogPostNode(post, seo),
        breadcrumb([
          { name: 'Savor', url: `${SITE_URL}/` },
          { name: 'Blog', url: `${SITE_URL}/blog/` },
          { name: post.title, url: seo.canonical },
        ]),
      )
    }
  } else if (seo.path === '/potluck') {
    graph.push(
      webPageNode(seo),
      appNode({
        id: `${SITE_URL}/potluck/#app`,
        name: 'Potluck by Savor',
        url: `${SITE_URL}/potluck/`,
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck',
        description: 'A playful dinner picker that spins once and chooses a recipe, with one-tap saving to Savor.',
        image: `${SITE_URL}/potluck/potluck-og.jpg`,
      }),
    )
  } else if (seo.path === '/caper') {
    graph.push(
      webPageNode(seo),
      appNode({
        id: `${SITE_URL}/caper/#app`,
        name: 'Caper',
        url: `${SITE_URL}/caper/`,
        downloadUrl: 'https://play.google.com/store/apps/details?id=com.calicosquid.forage',
        description: 'A seasonal wild-food companion for exploring edible plants, logging finds and cooking with what you bring home.',
        image: `${SITE_URL}/caper/caper-og.jpg`,
        price: '7.99',
      }),
    )
  } else if (seo.path === '/studio') {
    graph.push(webPageNode(seo, 'AboutPage'))
  } else {
    graph.push(webPageNode(seo))
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}
