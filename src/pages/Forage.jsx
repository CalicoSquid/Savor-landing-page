// src/pages/Forage.jsx — showcase page for Forage, the wild-food companion app.
// Own visual identity (forest green + terracotta + cream, straight from the
// app's own colors.js), shares the getsavor.recipes domain. Not part of the
// Savor family nav — reached via footer + direct link only.
import { useEffect } from 'react'
import './forage.css'
import Footer from '../components/Footer'

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.forage'

// Real field-guide volumes from the app's Contents screen. Numbered because
// the app genuinely organises its 893 species into these five volumes — the
// numbering encodes real structure, it isn't decoration.
const VOLUMES = [
  { no: 'I',   name: 'Herbs & Greens',  count: 200, sub: 'Edible foliage, shoots and herbaceous plants', color: '#2D4A3E' },
  { no: 'II',  name: 'Berries & Fruits', count: 368, sub: 'Sweet and savoury botanical fruits',          color: '#9B2D20' },
  { no: 'III', name: 'Wildflowers',     count: 62,  sub: 'Edible blossoms and floral parts',            color: '#5B3A8C' },
  { no: 'IV',  name: 'Roots & Tubers',  count: 171, sub: 'Underground energy stores',                    color: '#8A5A2B' },
  { no: 'V',   name: 'Trees & Shrubs',  count: 73,  sub: 'Bark, sap, leaves and woody plants',           color: '#2D4A3E' },
]

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
          <img src="/forage/forage-wordmark.png" alt="Forage" className="fg-wordmark fg-fade fg-fade-1" />
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

      {/* ── Signature: the Contents page ──────────────────────────────────── */}
      <section className="fg-contents" id="guide">
        <div className="fg-contents-inner">
          <p className="fg-overline">Forage · Field Guide</p>
          <h2 className="fg-contents-title">Contents</h2>
          <p className="fg-contents-sub">893 documented edible species, in five volumes.</p>

          <ol className="fg-volumes">
            {VOLUMES.map((v) => (
              <li className="fg-vol" key={v.no}>
                <span className="fg-vol-no">Vol. {v.no}</span>
                <span className="fg-vol-main">
                  <span className="fg-vol-name" style={{ color: v.color }}>{v.name}</span>
                  <span className="fg-vol-sub">{v.sub}</span>
                </span>
                <span className="fg-vol-count">{v.count}</span>
              </li>
            ))}
          </ol>

          <p className="fg-contents-foot">
            Species data sourced from the Plants For A Future database.
            Edibility ratings of 4 or above included.
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