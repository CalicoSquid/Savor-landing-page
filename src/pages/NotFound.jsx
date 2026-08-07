// src/pages/NotFound.jsx
import './pages.css'
import { Link } from 'react-router-dom'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'
import Footer from '../components/Footer'

export default function NotFound() {
  const { activeTheme } = useTheme()

  return (
    <>
      <main className="page">
        <div className="nf-wrap">
          <img
            src={getIcon(activeTheme.name)}
            alt=""
            className="nf-icon"
            width="160"
            height="160"
            decoding="async"
          />
          <span className="nf-code"><span className="num">404</span> · not found</span>
          <h1 className="nf-title">This recipe doesn’t exist.</h1>
          <p className="nf-lead">
            We looked everywhere — the pantry, the back of the drawer, that one
            cookbook with no cover. This page isn’t here. Maybe it was never
            written down.
          </p>
          <div className="nf-actions">
            <Link to="/" className="btn btn-green">Back to the kitchen</Link>
            <Link to="/faq/" className="btn btn-tertiary">Browse the FAQ</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}