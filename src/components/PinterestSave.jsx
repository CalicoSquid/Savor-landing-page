import { useState } from 'react'
import { pinterestSaveUrl } from '../lib/pinterest'
import './pinterest-save.css'

export default function PinterestSave({ details, className = 'blaff-pinterest' }) {
  const [status, setStatus] = useState('')
  const copy = async (label, value) => {
    try { await navigator.clipboard.writeText(value); setStatus(`${label} copied.`) }
    catch { setStatus('Copy is unavailable. You can select the text below instead.') }
  }
  return <div className="pinterest-share">
    <a className={className} href={pinterestSaveUrl(details)} target="_blank" rel="noopener noreferrer" aria-label={`Save ${details.title} to Pinterest`}>Save to Pinterest <span className="pinterest-new-tab" aria-hidden="true">↗</span></a>
    <details className="pinterest-copy">
      <summary>Pin text</summary>
      <p className="pinterest-copy-hint">Title and image description to use when creating or editing your Pin.</p>
      {[['Title', details.title], ['Description', details.description], ['Alt text', details.altText]].map(([label, value]) => <div className="pinterest-copy-field" key={label}>
        <div><strong>{label}</strong><button type="button" onClick={() => copy(label, value)} aria-label={`Copy Pin ${label.toLowerCase()}`}>Copy</button></div>
        <p>{value}</p>
      </div>)}
      <p className="pinterest-copy-status" role="status">{status}</p>
    </details>
  </div>
}
