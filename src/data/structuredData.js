import { FAQS } from './faqs.js'
import { BLOG_POSTS } from './blogPosts.js'
import { SITE_URL, PLAY_URL } from './seoPages.js'
import { PUBLIC_RECIPE_INDEX } from './publicRecipeIndex.generated.js'
import { TOOL_PAGES } from './toolPages.js'

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

function appNode({ id, name, url, downloadUrl, description, image, price, priceCurrency = 'GBP', operatingSystem = 'Android' }) {
  const node = {
    '@type': 'SoftwareApplication',
    '@id': id,
    name,
    applicationCategory: 'LifestyleApplication',
    operatingSystem,
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
  } else if (seo.path === '/iron-kitchen') {
    const ironKitchenId = 'https://ironkitcheninc.com/#organisation'
    graph.push(
      savorApplication,
      {
        '@type': 'Organization',
        '@id': ironKitchenId,
        name: 'Iron Kitchen Inc.',
        url: 'https://ironkitcheninc.com/',
      },
      {
        ...webPageNode(seo),
        about: [{ '@id': SAVOR_APP_ID }, { '@id': ironKitchenId }],
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Savor × Iron Kitchen Inc.', url: seo.canonical },
      ]),
    )
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
  } else if (seo.path === '/tools') {
    graph.push(
      {
        ...webPageNode(seo, 'CollectionPage'),
        mainEntity: { '@id': `${SITE_URL}/tools/#list` },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/tools/#list`,
        name: 'Free kitchen tools by Savor',
        numberOfItems: TOOL_PAGES.length,
        itemListElement: TOOL_PAGES.map((tool, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: tool.title,
          url: `${SITE_URL}${tool.href}`,
        })),
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Kitchen Tools', url: seo.canonical },
      ]),
    )
  } else if (seo.path === '/tools/recipe-scaler') {
    const scalerId = `${SITE_URL}/tools/recipe-scaler/#app`
    graph.push(
      {
        ...webPageNode(seo),
        mainEntity: { '@id': scalerId },
      },
      {
        '@type': 'WebApplication',
        '@id': scalerId,
        name: 'Savor Recipe Scaler',
        url: seo.canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        description: seo.description,
        publisher: { '@id': ORG_ID },
        featureList: [
          'Scale ingredient quantities to a new serving size',
          'Understand whole numbers, decimals and common fractions',
          'Scale quantity ranges',
          'Leave ingredient lines without a quantity unchanged',
          'Copy the scaled ingredient list',
          'Show chef notes for seasoning, eggs, baking and cooking time',
        ],
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Kitchen Tools', url: `${SITE_URL}/tools/` },
        { name: 'Recipe Scaler', url: seo.canonical },
      ]),
    )
  } else if (seo.path === '/tools/measurement-converter') {
    const converterId = `${SITE_URL}/tools/measurement-converter/#app`
    graph.push(
      {
        ...webPageNode(seo),
        mainEntity: { '@id': converterId },
      },
      {
        '@type': 'WebApplication',
        '@id': converterId,
        name: 'Savor Cooking Measurement Converter',
        url: seo.canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        description: seo.description,
        publisher: { '@id': ORG_ID },
        featureList: [
          'Convert cooking weights between grams, kilograms, ounces and pounds',
          'Convert cooking volumes between millilitres, litres, teaspoons, tablespoons, cups, fluid ounces, pints and quarts',
          'Convert Celsius and Fahrenheit temperatures',
          'Use the same ingredient conversion library as the Savor app when converting between cups and grams',
          'Convert a whole ingredient list between US and metric measurements',
          'Copy the converted recipe ingredient list',
        ],
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Kitchen Tools', url: `${SITE_URL}/tools/` },
        { name: 'Cooking Measurement Converter', url: seo.canonical },
      ]),
    )
  } else if (seo.path === '/tools/pan-converter') {
    const panConverterId = `${SITE_URL}/tools/pan-converter/#app`
    graph.push(
      {
        ...webPageNode(seo),
        mainEntity: { '@id': panConverterId },
      },
      {
        '@type': 'WebApplication',
        '@id': panConverterId,
        name: 'Savor Baking Pan Converter',
        url: seo.canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        description: seo.description,
        publisher: { '@id': ORG_ID },
        featureList: [
          'Compare round, square and rectangular baking pan sizes',
          'Choose common cake, loaf and sheet-pan presets or enter custom dimensions',
          'Switch pan dimensions between inches and centimetres',
          'Calculate the recipe multiplier needed to preserve batter depth',
          'Show how much shallower or deeper the original batter would sit in the new pan',
          'Scale a pasted ingredient list using the calculated pan-size multiplier',
          'Give practical baking-time and loaf-pan caveats without pretending bake time scales linearly',
        ],
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Kitchen Tools', url: `${SITE_URL}/tools/` },
        { name: 'Baking Pan Converter', url: seo.canonical },
      ]),
    )
  } else if (seo.path === '/tools/portion-planner') {
    const portionPlannerId = `${SITE_URL}/tools/portion-planner/#app`
    graph.push(
      {
        ...webPageNode(seo),
        mainEntity: { '@id': portionPlannerId },
      },
      {
        '@type': 'WebApplication',
        '@id': portionPlannerId,
        name: 'Savor Food Portion Planner',
        url: seo.canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        description: seo.description,
        publisher: { '@id': ORG_ID },
        featureList: [
          'Calculate practical food quantities for adults and children',
          'Adjust portions for main dishes, side dishes and buffet spreads',
          'Adjust for light, normal and hungry appetites',
          'Add a buffer for a little or plenty of leftovers',
          'Plan portions for pasta, rice, potatoes, meat, fish, vegetables, salad, bread, soup, sauce and cheese',
          'Display shopping quantities in metric or US units',
        ],
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Kitchen Tools', url: `${SITE_URL}/tools/` },
        { name: 'Food Portion Planner', url: seo.canonical },
      ]),
    )
  } else if (seo.path === '/tools/ingredient-substitutions') {
    const substitutionsId = `${SITE_URL}/tools/ingredient-substitutions/#app`
    graph.push(
      {
        ...webPageNode(seo),
        mainEntity: { '@id': substitutionsId },
      },
      {
        '@type': 'WebApplication',
        '@id': substitutionsId,
        name: 'Savor Ingredient Substitution Finder',
        url: seo.canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        description: seo.description,
        publisher: { '@id': ORG_ID },
        featureList: [
          'Search common cooking and baking ingredients for practical substitutes',
          'Choose substitutions based on how the ingredient is used in the recipe',
          'Show practical replacement ratios and preparation instructions',
          'Explain expected flavour and texture changes',
          'Warn when a substitute is a poor fit for a particular technique',
          'Cover common dairy, egg, flour, leavening, thickener, seasoning and pantry substitutions',
        ],
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Kitchen Tools', url: `${SITE_URL}/tools/` },
        { name: 'Ingredient Substitution Finder', url: seo.canonical },
      ]),
    )
  } else if (seo.path === '/tools/brine-calculator') {
    const brineCalculatorId = `${SITE_URL}/tools/brine-calculator/#app`
    graph.push(
      {
        ...webPageNode(seo),
        mainEntity: { '@id': brineCalculatorId },
      },
      {
        '@type': 'WebApplication',
        '@id': brineCalculatorId,
        name: 'Savor Fermentation Brine Calculator',
        url: seo.canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        description: seo.description,
        publisher: { '@id': ORG_ID },
        featureList: [
          'Calculate fermentation salt as a percentage of total vegetable and water weight',
          'Calculate water-only brine percentages when a recipe uses that convention',
          'Enter produce in grams or ounces and water in millilitres or US fluid ounces',
          'Show the exact salt amount in grams and ounces',
          'Keep total-weight and water-only percentage conventions visibly separate',
          'Explain the calculation formula and preservation limitations',
        ],
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Kitchen Tools', url: `${SITE_URL}/tools/` },
        { name: 'Fermentation Brine Calculator', url: seo.canonical },
      ]),
    )
  } else if (seo.path === '/tools/bakers-percentage') {
    const bakersPercentageId = `${SITE_URL}/tools/bakers-percentage/#app`
    graph.push(
      {
        ...webPageNode(seo),
        mainEntity: { '@id': bakersPercentageId },
      },
      {
        '@type': 'WebApplication',
        '@id': bakersPercentageId,
        name: 'Savor Baker’s Percentage & Dough Hydration Calculator',
        url: seo.canonical,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web browser',
        browserRequirements: 'Requires JavaScript',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'GBP' },
        description: seo.description,
        publisher: { '@id': ORG_ID },
        featureList: [
          'Calculate true dough hydration by weight',
          'Include the flour and water inside sourdough starter or preferment',
          'Calculate salt percentage and prefermented flour percentage',
          'Show total flour, total water and total dough weight',
          'Scale bread or pizza dough to a chosen number of loaves or dough balls',
          'Use grams or ounces and copy the scaled formula',
        ],
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Kitchen Tools', url: `${SITE_URL}/tools/` },
        { name: 'Baker’s Percentage & Dough Hydration', url: seo.canonical },
      ]),
    )
  } else if (seo.path === '/recipes') {
    graph.push(
      {
        ...webPageNode(seo, 'CollectionPage'),
        mainEntity: { '@id': `${SITE_URL}/recipes/#list` },
      },
      {
        '@type': 'ItemList',
        '@id': `${SITE_URL}/recipes/#list`,
        name: 'Original recipes shared on Savor',
        numberOfItems: PUBLIC_RECIPE_INDEX.length,
        itemListElement: PUBLIC_RECIPE_INDEX.map((recipe, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: recipe.name,
          url: `${SITE_URL}/r/${encodeURIComponent(recipe.id)}`,
        })),
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Community recipes', url: seo.canonical },
      ]),
    )
  } else if (seo.path === '/potluck') {
    const potluckAppId = `${SITE_URL}/potluck/#app`
    graph.push(
      {
        ...webPageNode(seo),
        mainEntity: { '@id': potluckAppId },
      },
      {
        ...appNode({
          id: potluckAppId,
          name: 'Potluck by Savor',
          url: `${SITE_URL}/potluck/`,
          downloadUrl: 'https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck',
          description: 'A free random dinner and recipe generator with a cosmic attitude. Spin in the browser for a real recipe, or install Potluck on Android for weekly dinner memory and more.',
          operatingSystem: 'Web browser, Android',
          image: `${SITE_URL}/potluck/potluck-og.jpg`,
          price: 0,
        }),
        alternateName: ['Potluck', 'Potluck Random Dinner Generator'],
        applicationSubCategory: 'Random dinner and recipe generator',
        isAccessibleForFree: true,
        browserRequirements: 'Requires JavaScript',
        featureList: [
          'Pick a random dinner recipe in the browser',
          'Open the selected recipe with ingredients and method',
          'Reroll when the first dinner suggestion is not right',
          'No signup required for the web spinner',
          'Remember recent dinner choices in the Android app',
        ],
      },
      breadcrumb([
        { name: 'Savor', url: `${SITE_URL}/` },
        { name: 'Potluck', url: seo.canonical },
      ]),
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
