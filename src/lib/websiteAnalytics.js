import { GA_MEASUREMENT_ID } from '../data/analyticsConfig.js'

const CONSENT_KEY = 'savor:website-analytics-consent:v1'
const EVENTS = new Set(['app_store_click', 'save_to_savor', 'pinterest_save', 'recipe_open', 'series_filter', 'tool_use', 'potluck_spin', 'file_download'])
const PARAMS = new Set(['destination', 'placement', 'recipe_path', 'series', 'tool', 'action'])

export function createWebsiteAnalytics(win, doc, measurementId) {
  const available = /^G-[A-Z0-9]+$/.test(measurementId) &&
    ['getsavor.recipes', 'www.getsavor.recipes'].includes(win.location.hostname)
  const enabled = available &&
    !win.navigator.globalPrivacyControl && win.navigator.doNotTrack !== '1'
  let choice = null
  let initialized = false
  let lastPage = null
  try {
    const saved = JSON.parse(win.localStorage.getItem(CONSENT_KEY))
    if (['accepted', 'declined'].includes(saved?.choice) && Date.now() - saved.at < 180 * 86400000) choice = saved.choice
  } catch { /* Unavailable storage leaves consent unset. */ }

  const location = () => `${win.location.origin}${win.location.pathname}`
  const referrer = value => { try { return new URL(value).origin } catch { return '' } }
  function gtag() { win.dataLayer.push(arguments) }
  function initialize() {
    if (!enabled || choice !== 'accepted') return false
    win[`ga-disable-${measurementId}`] = false
    if (initialized) return true
    initialized = true
    win.dataLayer = win.dataLayer || []
    win.gtag = gtag
    gtag('consent', 'default', { analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' })
    gtag('consent', 'update', { analytics_storage: 'granted' })
    gtag('js', new Date())
    gtag('config', measurementId, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, page_location: location(), page_referrer: referrer(doc.referrer) })
    const script = doc.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    doc.head.appendChild(script)
    return true
  }
  return {
    available,
    enabled,
    getConsent: () => choice,
    setConsent(next) {
      if (!['accepted', 'declined'].includes(next)) return
      choice = next
      if (choice === 'accepted' && initialized) gtag('consent', 'update', { analytics_storage: 'granted' })
      try { win.localStorage.setItem(CONSENT_KEY, JSON.stringify({ choice, at: Date.now() })) } catch { /* Remember for this page only. */ }
      if (choice === 'declined') {
        win[`ga-disable-${measurementId}`] = true
        if (initialized) gtag('consent', 'update', { analytics_storage: 'denied' })
        lastPage = null
        // Remove GA cookies on both the host and the parent domain when withdrawing.
        for (const cookie of doc.cookie.split(';')) {
          const name = cookie.split('=')[0].trim()
          if (!/^_ga(?:_|$)/.test(name)) continue
          for (const domain of ['', `; Domain=${win.location.hostname}`, '; Domain=.getsavor.recipes']) {
            doc.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax`
          }
        }
      }
      win.dispatchEvent(new win.Event('savor-analytics-consent'))
    },
    page() {
      if (!initialize()) return
      const current = location()
      if (lastPage === current) return
      gtag('event', 'page_view', { page_location: current, page_referrer: lastPage || referrer(doc.referrer), page_title: doc.title })
      lastPage = current
    },
    event(name, params = {}) {
      if (!EVENTS.has(name) || !initialize()) return
      const safe = Object.fromEntries(Object.entries(params).filter(([key, value]) => PARAMS.has(key) && typeof value === 'string' && value.length <= 150 && !/[?@#]/.test(value)))
      gtag('event', name, { ...safe, page_location: location(), page_referrer: referrer(doc.referrer) })
    },
  }
}

export const websiteAnalytics = typeof window === 'undefined' ? null : createWebsiteAnalytics(window, document, GA_MEASUREMENT_ID)
export const trackWebsiteEvent = (name, params) => websiteAnalytics?.event(name, params)

export function trackWebsiteClick(anchor) {
  if (!anchor?.href) return
  let url
  try { url = new URL(anchor.href, window.location.href) } catch { return }
  const placement = anchor.closest('nav') ? 'navigation' : anchor.closest('footer') ? 'footer' : 'content'
  const label = (anchor.textContent || '').toLowerCase()
  if (url.hostname === 'play.google.com' || url.hostname === 'apps.apple.com' || (url.origin === window.location.origin && /^\/app\/?$/.test(url.pathname))) {
    trackWebsiteEvent('app_store_click', { destination: url.hostname === 'apps.apple.com' ? 'app_store' : 'google_play', placement })
  } else if (url.protocol === 'savor:' || (url.protocol === 'intent:' && label.includes('save'))) {
    trackWebsiteEvent('save_to_savor', { placement })
  } else if (/(^|\.)pinterest\.com$/.test(url.hostname) && url.pathname.includes('/pin/create')) {
    trackWebsiteEvent('pinterest_save', { placement })
  } else if (url.origin === window.location.origin && /^\/(blog|r)\//.test(url.pathname)) {
    trackWebsiteEvent('recipe_open', { recipe_path: url.pathname, placement })
  } else if (url.origin === window.location.origin && /\.pdf$/i.test(url.pathname)) {
    trackWebsiteEvent('file_download', { destination: url.pathname, placement })
  }
}
