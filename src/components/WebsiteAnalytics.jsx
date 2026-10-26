import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { websiteAnalytics, trackWebsiteClick, trackWebsiteEvent } from '../lib/websiteAnalytics'
import './website-analytics.css'

export default function WebsiteAnalytics() {
  const { pathname } = useLocation()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!websiteAnalytics?.available) return
    const refresh = () => { setOpen(websiteAnalytics.enabled && websiteAnalytics.getConsent() === null); websiteAnalytics.page() }
    const settings = () => setOpen(true)
    const click = event => trackWebsiteClick(event.target.closest?.('a'))
    const tool = event => {
      if (window.location.pathname.startsWith('/tools/') && event.target.matches('input, select, textarea')) {
        trackWebsiteEvent('tool_use', { tool: window.location.pathname.split('/')[2] || 'tools', action: 'change' })
      }
    }
    refresh()
    window.addEventListener('savor-analytics-consent', refresh)
    window.addEventListener('savor-analytics-settings', settings)
    document.addEventListener('click', click, true)
    document.addEventListener('change', tool)
    return () => {
      window.removeEventListener('savor-analytics-consent', refresh)
      window.removeEventListener('savor-analytics-settings', settings)
      document.removeEventListener('click', click, true)
      document.removeEventListener('change', tool)
    }
  }, [])
  useEffect(() => { websiteAnalytics?.page() }, [pathname])
  if (!open) return null
  if (!websiteAnalytics.enabled) return <section className="analytics-consent" aria-label="Website analytics preferences"><p>Your browser requests no tracking. Website analytics stays off.</p><button type="button" onClick={() => setOpen(false)}>Close</button></section>
  return <section className="analytics-consent" aria-label="Website analytics preferences">
    <div><strong>A little feedback for the cook?</strong><p>Allow Google Analytics to measure visits and clicks so we can improve Savor. Optional, with no advertising features. <a href="/privacy/">Privacy details</a></p></div>
    <div className="analytics-consent-actions">
      <button type="button" onClick={() => { websiteAnalytics.setConsent('declined'); setOpen(false) }}>No thanks</button>
      <button type="button" onClick={() => { websiteAnalytics.setConsent('accepted'); setOpen(false) }}>Allow analytics</button>
    </div>
  </section>
}
