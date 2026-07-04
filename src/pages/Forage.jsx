// src/pages/Forage.jsx — showcase page for Forage, the wild-food companion app.
// Own visual identity (forest green + terracotta + cream, straight from the
// app's own colors.js), shares the getsavor.recipes domain. Not part of the
// Savor family nav — reached via footer + direct link only.
import { useEffect } from 'react'
import './forage.css'
import Footer from '../components/Footer'
import SeasonExplorer from '../components/forage/SeasonExplorer'
import BadgeWall from '../components/forage/BadgeWall'

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.forage'

const FEATURES = [
  {
    eyebrow: 'Forage Near Me',
    title: "What's out there, right now",
    body: 'See wild edibles in season near you, ranked by what people are actually finding. Every card tells you the part to eat, how common it is, and what to watch for — before you pick.',
    img: '/forage/aso/whats-out-there.png',
    alt: 'Forage — wild edibles in season near you',
  },
  {
    eyebrow: 'The Field Guide',
    title: 'Know before you pick',
    body: '893 documented edible species, each with safety ratings, seasons and habitats. Species data drawn from the Plants For A Future database — only edibility ratings of 4 and above.',
    img: '/forage/aso/know-before-you-pick.png',
    alt: 'Forage field guide with 893 wild plants',
  },
  {
    eyebrow: 'Campfire Kitchen',
    title: 'Wild recipes, built around what you find',
    body: "Log a find and the Campfire Cookbook fills with recipes you can actually make from it. Something to cook for everything you bring home.",
    img: '/forage/aso/campfire-cookbook.png',
    alt: 'Campfire Cookbook — wild recipes',
  },
  {
    eyebrow: 'Your Logbook',
    title: 'Every find, remembered',
    body: 'Log your spots, photos and notes. Build a personal record of what you found and where, season by season — a watchlist for what you want to find next.',
    img: '/forage/aso/logbook.png',
    alt: 'Forage logbook of your finds',
  },
]

export default function Forage() {
  useEffect(() => {
    document.title = 'Forage — Find Dinner in the Wild | Wild Food Foraging App'
    const setMeta = (name, content, attr = 'name') => {
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, name); document.head.appendChild(el) }
      el.setAttribute('content', content)
    }
    const desc = 'Forage is a wild-food companion app made by a chef. Identify 893 wild edibles with safety ratings, see what\u2019s in season near you, cook what you find, and keep every find in your logbook. One payment, no subscription.'
    setMeta('description', desc)
    setMeta('og:title', 'Forage — Find Dinner in the Wild', 'property')
    setMeta('og:description', desc, 'property')
    setMeta('og:image', 'https://getsavor.recipes/forage/aso/find-dinner.png', 'property')
    setMeta('og:url', 'https://getsavor.recipes/forage', 'property')
    setMeta('og:type', 'website', 'property')
    setMeta('twitter:card', 'summary_large_image')

    let link = document.querySelector('link[rel="canonical"]')
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link) }
    link.setAttribute('href', 'https://getsavor.recipes/forage')

    return () => {
      setMeta('robots', 'index, follow')
      const l = document.querySelector('link[rel="canonical"]')
      if (l) l.setAttribute('href', window.location.origin + '/')
    }
  }, [])

  return (
    <main className="page forage-page" data-nav-theme="forage">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="fg-hero">
        <div className="fg-hero-inner">
          <img src="/forage/forage-wordmark.webp" alt="Forage" className="fg-wordmark fg-fade fg-fade-1" />
          <p className="fg-hero-tagline fg-fade fg-fade-2">Find it. Learn it. Cook it.</p>
          <p className="fg-hero-sub fg-fade fg-fade-3">
            Free food is growing near you right now. Forage helps you find wild
            edibles, learn them safely, and cook what you bring home — even if
            you&rsquo;ve never foraged before.
          </p>
          <div className="fg-hero-cta fg-fade fg-fade-4">
            <a href={PLAY_URL} className="fg-btn fg-btn-primary" target="_blank" rel="noreferrer">
              Get Forage
            </a>
            <a href="#guide" className="fg-btn fg-btn-ghost">Browse the field guide</a>
          </div>
          <p className="fg-hero-note fg-fade fg-fade-4">Now in early testing on Android</p>
        </div>
        <div className="fg-hero-rule" aria-hidden="true" />
      </section>

      {/* ── Signature: interactive seasonal explorer ──────────────────────── */}
      <section className="fg-explorer-section" id="guide">
        <SeasonExplorer />
      </section>

      {/* ── Field guide note ──────────────────────────────────────────────── */}
      <section className="fg-guidenote">
        <div className="fg-guidenote-inner">
          <p className="fg-overline">Forage · Field Guide</p>
          <h2 className="fg-guidenote-title">893 species, five volumes</h2>
          <p className="fg-guidenote-sub">
            Herbs &amp; greens, berries &amp; fruits, wildflowers, roots &amp;
            tubers, trees &amp; shrubs — each with safety ratings, seasons and
            habitats. Species data from the Plants For A Future database,
            edibility 4 and above.
          </p>
        </div>
      </section>

      {/* ── Features (alternating) ────────────────────────────────────────── */}
      <section className="fg-features">
        {FEATURES.map((f, i) => (
          <div className={`fg-feature ${i % 2 ? 'fg-feature--rev' : ''}`} key={f.title}>
            <div className="fg-feature-copy">
              <p className="fg-eyebrow">{f.eyebrow}</p>
              <h3 className="fg-feature-title">{f.title}</h3>
              <p className="fg-feature-body">{f.body}</p>
            </div>
            <div className="fg-feature-shot">
              <img src={f.img} alt={f.alt} loading="lazy" />
            </div>
          </div>
        ))}
      </section>

      {/* ── Collectible badge wall ────────────────────────────────────────── */}
      <section className="fg-badges-section">
        <BadgeWall />
      </section>

      {/* ── Campfire Cookbook (dark ember beat) ───────────────────────────── */}
      <section className="fg-campfire">
        <div className="fg-campfire-glow" aria-hidden="true" />
        <div className="fg-campfire-inner">
          <div className="fg-campfire-copy">
            <p className="fg-eyebrow fg-eyebrow--ember">Campfire Kitchen</p>
            <h2 className="fg-campfire-title">Then you cook it</h2>
            <p className="fg-campfire-lead">
              Every find opens the Campfire Cookbook — wild recipes built around
              what you actually brought home. Something to cook for everything
              you find, sorted by kind and ready when you are.
            </p>
            <ul className="fg-kinds">
              {['Herb', 'Berry', 'Flower', 'Root', 'Tree', 'Nut'].map((k) => (
                <li className="fg-kind" key={k}>{k}</li>
              ))}
            </ul>
            <p className="fg-campfire-note">
              Six kinds of wild ingredient, each with recipes waiting.
            </p>
          </div>
          <div className="fg-campfire-shot">
            <img
              src="/forage/aso/campfire-phone.webp"
              alt="Campfire Cookbook — wild recipes built around what you find"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* ── Yours Forever / pricing ───────────────────────────────────────── */}
      <section className="fg-forever">
        <div className="fg-forever-inner">
          <p className="fg-eyebrow fg-eyebrow--light">One payment</p>
          <h2 className="fg-forever-title">Yours forever</h2>
          <p className="fg-forever-sub">
            Buy Forage once and it&rsquo;s yours — every find, photo and badge stays
            with you. No subscription, ever. Try it free for 7 days first.
          </p>
          <div className="fg-forever-cta">
            <a href={PLAY_URL} className="fg-btn fg-btn-primary" target="_blank" rel="noreferrer">
              Get Forage on Android
            </a>
          </div>
          <p className="fg-forever-price">7 days free · then £7.99 once</p>
        </div>
      </section>

      <Footer />
    </main>
  )
}