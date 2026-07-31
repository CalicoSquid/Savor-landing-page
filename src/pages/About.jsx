// src/pages/About.jsx
import { useEffect } from 'react'
import './pages.css'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const PLAY_URL =
  'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes'

export default function About() {
  useEffect(() => {
    document.title = 'About Savor — A Recipe App Made by a Chef'
  }, [])

  return (
    <>
      <main className="page doc-page">
        <div className="container doc-inner">
          <span className="doc-eyebrow">About</span>
          <h1 className="doc-title">A recipe app made by a chef who got tired of recipe apps.</h1>
          <p className="doc-lead">
            Savor started the day I found my mum’s old recipe cards — tattered,
            smudged, stained, and still meaning the world to me. I wanted a place
            worthy of them. Not another feed of ads and pop-ups and a thousand
            words before the ingredients. Just the recipes, and a home for them.
          </p>

          <div className="about-block">
            <h2>What Savor does</h2>
            <p>
              <strong>Save from anywhere.</strong> Savor has a browser built in.
              Find a recipe you love on any website and one tap imports it
              properly — the photo, the ingredients, the steps — with none of the
              clutter that surrounded it.
            </p>
            <p>
              <strong>Rescue what’s on paper.</strong> Point your camera at a
              cookbook page or a handwritten card and Savor reads it, rebuilds it,
              and even finds an image when there isn’t one. Recipes that nearly
              disappeared, brought back.
            </p>
            <p>
              <strong>Cook from memory.</strong> Got a recipe rattling around in
              your head? Type it out, however roughly, and Savor turns it into a
              real card you can actually cook from.
            </p>
            <p>
              <strong>Share, quietly.</strong> Savor’s community feed is
              deliberately calm and algorithm-free — cooks showing what they made
              for lunch today, not chasing a viral moment. Save anything that
              looks good.
            </p>
          </div>

          <div className="about-block">
            <h2>Why it’s different</h2>
            <p>
              I spent years cooking professionally, and the apps I tried never
              respected the recipe or the cook. So Savor has no ads, no life
              stories, no endless scroll. It strips every recipe down to what you
              actually need, and then gets out of your way. You can even dress the
              whole app in one of twelve colour themes — because cooking should
              feel like yours.
            </p>
          </div>

          <div className="about-block">
            <h2>Who’s behind it</h2>
            <p>
              Savor is built by one former chef, working solo under the name{' '}
              <strong>CalicoSquid</strong>, from a farm in Montenegro. It’s part of
              a small family of cooking apps — alongside <strong>Caper</strong>, a
              companion for wild food, and <strong>Potluck</strong>, a playful way
              to decide what’s for dinner. Made by someone who actually cooks, for
              people who actually cook.
            </p>
          </div>

          <div className="doc-cta">
            <h2>A home for every recipe that matters.</h2>
            <a
              href={PLAY_URL}
              target="_blank"
              rel="noreferrer"
              className="doc-cta-badge-link"
            >
              <img
                src="/potluck/play2.webp"
                alt="Get Savor on Google Play"
                className="doc-cta-badge"
                width="440"
                height="121"
                loading="lazy"
                decoding="async"
              />
            </a>
            <Link
              to="/faq"
              style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}
            >
              Read the frequently asked questions →
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
