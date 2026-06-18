// src/pages/Faq.jsx
import { useEffect } from 'react'
import './pages.css'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import { FAQS } from '../data/faqs'

const PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes'

export default function Faq() {
  useEffect(() => {
    document.title = 'Savor FAQ — Questions About the Recipe App'
  }, [])

  return (
    <>
      <main className="page doc-page">
        <div className="container doc-inner">
          <span className="doc-eyebrow">Questions</span>
          <h1 className="doc-title">Savor, answered.</h1>
          <p className="doc-lead">
            Everything you might want to know before you start saving recipes.
            Still stuck? The fastest way to see what Savor does is to try it.
          </p>

          <div className="faq-list">
            {FAQS.map(({ q, a }) => (
              <details className="faq-item" key={q}>
                <summary>{q}</summary>
                <div className="faq-answer">{a}</div>
              </details>
            ))}
          </div>

          <div className="doc-cta">
            <h2>Cook in colour.</h2>
            <a
              href={PLAY_URL}
              target="_blank"
              rel="noreferrer"
              className="doc-cta-badge-link"
            >
              <img
                src="/potluck/play2.png"
                alt="Get Savor on Google Play"
                className="doc-cta-badge"
              />
            </a>
            <Link
              to="/about"
              style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
            >
              Read the story behind Savor →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
