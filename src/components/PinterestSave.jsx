import { pinterestSaveUrl } from '../lib/pinterest'
import './pinterest-save.css'

export default function PinterestSave({ details, className = 'blaff-pinterest' }) {
  return <div className="pinterest-share">
    <a className={className} href={pinterestSaveUrl(details)} target="_blank" rel="noopener noreferrer" aria-label={`Save ${details.title} to Pinterest`}>Save to Pinterest <span className="pinterest-new-tab" aria-hidden="true">↗</span></a>
  </div>
}
