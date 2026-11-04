import test from 'node:test'
import assert from 'node:assert/strict'
import { BLOG_POSTS } from '../src/data/blogPosts.js'
import { PINTEREST_RECIPES } from '../src/data/pinterest.js'
import { createPinterestDetails, originalPinterestDetails, recipePinterestDetails, pinterestSaveUrl, pinterestImageAttributes, pinterestMediaUrl } from '../src/lib/pinterest.js'

test('each Original has distinct Pin copy and accessible photo text within Pinterest limits', () => {
  for (const slug of Object.keys(PINTEREST_RECIPES)) {
    const post = BLOG_POSTS.find(post => post.slug === slug)
    assert.ok(post)
    const pin = originalPinterestDetails(post)
    assert.ok(pin.title.length > 20 && pin.title.length <= 100)
    assert.ok(pin.description.length > 150 && pin.description.length <= 500)
    assert.ok(pin.altText.length > 40 && pin.altText.length <= 500)
    assert.notEqual(pin.altText, pin.description)
    assert.ok(!pin.description.includes('#'))
    const link = new URL(pinterestSaveUrl(pin))
    assert.equal(link.searchParams.get('url'), `https://getsavor.recipes/blog/${slug}/`)
    assert.equal(link.searchParams.get('media'), post.ogImage)
    assert.equal(link.searchParams.get('description'), pin.description)
    assert.ok(!link.searchParams.has('alt_text'), 'Do not invent unsupported Save parameters')
    assert.ok(!link.searchParams.has('title'))
    assert.equal(pinterestImageAttributes(pin)['data-pin-description'], pin.description)
  }
})
test('burger Pin retains recipe and photo attribution without claiming the sauce is pictured', () => {
  const pin = originalPinterestDetails(BLOG_POSTS.find(post => post.slug === 'smash-burgers-pickle-mustard-sauce'))
  assert.match(pin.description, /Iron Kitchen/)
  assert.match(pin.description, /classic burger is pictured/)
  assert.match(pin.altText, /Photo: Iron Kitchen Inc\./)
})
test('shared recipe fallback preserves source and photo credit even when the description is long', () => {
  const pin = recipePinterestDetails({ name: 'Beans &amp; rice', description: 'A long description. '.repeat(100), image: '/photo.jpg', sourceUrl: 'https://publisher.example/beans', imageCredit: { photographer: 'Photo Person' } }, 'https://getsavor.recipes/r/123')
  assert.equal(pin.title, 'Beans & rice')
  assert.ok(pin.description.length <= 500)
  assert.match(pin.description, /Original recipe: publisher\.example\./)
  assert.match(pin.description, /Photo: Photo Person\./)
  assert.equal(pin.image, 'https://getsavor.recipes/photo.jpg')
})
test('missing or invalid media is omitted so Pinterest can use its image picker', () => {
  for (const image of [null, 'data:image/png;base64,bad', 'javascript:alert(1)']) {
    const pin = createPinterestDetails({ title: 'A recipe', image, url: '/r/123' })
    assert.equal(new URL(pinterestSaveUrl(pin)).searchParams.has('media'), false)
    assert.equal(pin.url, 'https://getsavor.recipes/r/123')
  }
})
test('dynamic descriptions add known timing and servings without fabricating either', () => {
  const pin = recipePinterestDetails({ name: 'Stew', times: { total: { hours: 1, minutes: 15 } }, recipeYield: '4 servings' }, '/r/123')
  assert.match(pin.description, /75 minutes/)
  assert.match(pin.description, /4 servings/)
  const empty = recipePinterestDetails({ name: 'Stew' }, '/r/123')
  assert.ok(!empty.description.includes('minutes'))
  assert.ok(!empty.description.includes('servings'))
})


test('Pinterest alone gets larger supported image variants without changing page media or credits', () => {
  const image = 'https://images.unsplash.com/photo-test?w=400&q=80&ixid=keep-me&fit=max'
  const details = recipePinterestDetails({ name: 'Soup', image, imageCredit: { photographer: 'Photo Person' } }, '/r/test')
  assert.equal(details.image, image, 'Page/OG image must stay unchanged')
  const media = new URL(new URL(pinterestSaveUrl(details)).searchParams.get('media'))
  assert.equal(media.searchParams.get('w'), '1200')
  assert.equal(media.searchParams.get('ixid'), 'keep-me')
  assert.equal(media.searchParams.get('q'), '80')
  assert.match(details.description, /Photo Person/)
  assert.equal(pinterestImageAttributes(details)['data-pin-media'], media.href)
  const pexels = new URL(pinterestMediaUrl('https://images.pexels.com/photos/123/photo.jpeg?w=600&h=400&auto=compress'))
  assert.equal(pexels.searchParams.get('w'), '1200')
  assert.equal(pexels.searchParams.get('h'), '800')
  assert.equal(pexels.searchParams.get('auto'), 'compress')
  for (const unchanged of [
    'https://images.unsplash.com/photo-test?w=2000&q=80',
    'https://images.pexels.com/photos/123/photo.jpeg?h=650',
    'https://example.org/photo.jpg?w=400',
    'https://images.unsplash.com.evil.example/photo-test?w=400',
    'https://getsavor.recipes/images/recipes/photo.webp',
  ]) assert.equal(pinterestMediaUrl(unchanged), unchanged)
  assert.equal(pinterestMediaUrl(null), '')
})
