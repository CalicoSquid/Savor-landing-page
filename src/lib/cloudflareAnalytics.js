// Public beacon token. Reporting credentials never belong in the website.
const BEACON_TOKEN = 'bcb69c27c42743a3b14876c6fb8b852a'

export function startCloudflareAnalytics() {
  // Exclude development, deploy previews and browsers requesting no tracking.
  if (!['getsavor.recipes', 'www.getsavor.recipes'].includes(window.location.hostname) ||
      navigator.globalPrivacyControl || navigator.doNotTrack === '1' ||
      document.querySelector('script[data-cf-beacon]')) return

  const script = document.createElement('script')
  script.type = 'module'
  script.src = 'https://static.cloudflareinsights.com/beacon.min.js'
  script.dataset.cfBeacon = JSON.stringify({ token: BEACON_TOKEN })
  // Cloudflare handles History API navigation; do not add a second page counter.
  document.body.appendChild(script)
}
