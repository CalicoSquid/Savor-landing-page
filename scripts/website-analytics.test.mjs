import test from 'node:test'
import assert from 'node:assert/strict'
import { createWebsiteAnalytics } from '../src/lib/websiteAnalytics.js'

function fixture({ hostname = 'getsavor.recipes', privacy = {}, stored = null, blockedStorage = false } = {}) {
  const scripts = [], cookies = []
  const win = {
    location: { hostname, origin: `https://${hostname}`, pathname: '/originals/', search: '?email=private@example.com' },
    navigator: privacy, Event,
    localStorage: { getItem: () => { if (blockedStorage) throw new Error('blocked'); return stored }, setItem: () => { if (blockedStorage) throw new Error('blocked') } },
    dispatchEvent() {},
  }
  const doc = { title: 'Savor Originals', referrer: 'https://search.example/results?email=private@example.com', createElement: () => ({}), head: { appendChild: node => scripts.push(node) } }
  Object.defineProperty(doc, 'cookie', { get: () => '_ga=old; _ga_TEST=old; essential=keep', set: value => cookies.push(value) })
  return { win, doc, scripts, cookies, analytics: createWebsiteAnalytics(win, doc, 'G-FVYNQFT5Y9') }
}
const commands = win => (win.dataLayer || []).map(args => Array.from(args))
const events = win => commands(win).filter(args => args[0] === 'event')

test('no Google tag or events before consent, or after rejecting', () => {
  const { analytics, scripts, win } = fixture()
  analytics.page(); analytics.event('potluck_spin')
  assert.equal(scripts.length, 0); assert.deepEqual(events(win), [])
  analytics.setConsent('declined'); analytics.page(); analytics.event('potluck_spin')
  assert.equal(scripts.length, 0); assert.deepEqual(events(win), [])
})
test('consent loads only the Savor tag, suppresses default pageviews and deduplicates route effects', () => {
  const { analytics, scripts, win } = fixture()
  analytics.setConsent('accepted'); analytics.page(); analytics.page()
  assert.equal(scripts.length, 1)
  assert.equal(scripts[0].src, 'https://www.googletagmanager.com/gtag/js?id=G-FVYNQFT5Y9')
  assert.equal(commands(win).find(args => args[0] === 'config')[2].send_page_view, false)
  assert.equal(events(win).length, 1)
  win.location.pathname = '/tools/recipe-scaler/'
  analytics.page()
  assert.equal(events(win).length, 2)
  assert.equal(events(win)[1][2].page_referrer, 'https://getsavor.recipes/originals/')
  assert.ok(!JSON.stringify(commands(win)).includes('private@example.com'))
})
test('withdrawal stops events and removes only GA cookies; reacceptance restores consent without duplicate tag', () => {
  const { analytics, scripts, win, cookies } = fixture()
  analytics.setConsent('accepted'); analytics.page()
  analytics.setConsent('declined'); analytics.event('potluck_spin'); analytics.page()
  assert.equal(events(win).length, 1)
  assert.equal(win['ga-disable-G-FVYNQFT5Y9'], true)
  assert.ok(cookies.some(value => value.startsWith('_ga=')))
  assert.ok(cookies.every(value => !value.startsWith('essential=')))
  analytics.setConsent('accepted'); analytics.page()
  assert.equal(win['ga-disable-G-FVYNQFT5Y9'], false)
  assert.equal(scripts.length, 1)
  assert.deepEqual(commands(win).filter(args => args[0] === 'consent').at(-1), ['consent', 'update', { analytics_storage: 'granted' }])
})
test('tracking is off on preview hosts and for browser privacy signals even with stored consent', () => {
  for (const options of [{ hostname: 'localhost' }, { hostname: 'preview.netlify.app' }, { privacy: { globalPrivacyControl: true } }, { privacy: { doNotTrack: '1' } }]) {
    const { analytics, scripts } = fixture({ ...options, stored: JSON.stringify({ choice: 'accepted', at: Date.now() }) })
    analytics.page(); analytics.event('potluck_spin')
    assert.equal(scripts.length, 0)
  }
})
test('blocked storage and expired choices default safely; only named events and safe parameters are sent', () => {
  const expired = fixture({ stored: JSON.stringify({ choice: 'accepted', at: Date.now() - 181 * 86400000 }) })
  expired.analytics.page(); assert.equal(expired.scripts.length, 0)
  const { analytics, win } = fixture({ blockedStorage: true })
  analytics.setConsent('accepted'); analytics.event('not_allowed', { email: 'private@example.com' })
  analytics.event('tool_use', { tool: 'recipe-scaler', action: 'change', content: 'private text', destination: 'private@example.com' })
  assert.equal(events(win).length, 1)
  assert.equal(events(win)[0][2].tool, 'recipe-scaler')
  assert.ok(!JSON.stringify(events(win)).includes('private'))
})
