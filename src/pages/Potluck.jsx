// src/pages/Potluck.jsx — showcase page for the (new) Potluck app.
import './potluck.css'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck'

const STEPS = [
  {
    badge: '🎰',
    title: 'Spin the wheel.',
    body: 'One tap. The reels tumble. No menus, no scrolling, no twenty open tabs — just turn it over to fate.',
  },
  {
    badge: '🍽️',
    title: 'The universe decides.',
    body: "One recipe lands. That's dinner. The wheel doesn't miss — and it's got opinions about your choices.",
  },
  {
    badge: { img: '/icons/icon-Tangerine.webp', alt: 'Savor' },
    title: 'Save it to Savor.',
    body: 'Love what landed? One tap sends it straight to Savor, saved and scaled and yours for next time.',
  },
]

const VERDICTS = [
  'Resistance is futile. Also delicious.',
  'Good luck doing better.',
  'Don’t make it weird. Just cook it.',
  'That’s dinner. No appeals.',
  'Pudding counts as dinner. Officially, now.',
  'Stop scrolling. Start cooking.',
]

export default function Potluck() {

  return (
    <>
      <main className="page potluck-page">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section className="pl-hero">
          <div className="pl-container pl-hero-inner">
            <img
              src="/potluck/potluck_wordmark.webp"
              alt="Potluck"
              className="pl-wordmark"
              width="640"
              height="241"
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />

            <div className="pl-wheel" aria-hidden="true">
              <img
                src="/potluck/outer.webp"
                alt=""
                className="pl-wheel-outer"
                width="640"
                height="640"
                loading="eager"
                decoding="async"
              />
              <span className="pl-wheel-spin">
                <img
                  src="/potluck/spinner.webp"
                  alt=""
                  className="pl-wheel-spinner"
                  width="512"
                  height="512"
                  loading="eager"
                  decoding="async"
                />
              </span>
              <span className="pl-wheel-glass-t" />
              <span className="pl-wheel-glass-b" />
              <span className="pl-wheel-marker l" />
              <span className="pl-wheel-marker r" />
            </div>

            <h1 className="pl-h1">One spin. <span className="spark">Dinner, decided.</span></h1>
            <p className="pl-sub">
              No scrolling. No deciding. Let the universe pick tonight’s recipe —
              you just turn the oven on.
            </p>
            <a href={PLAY_URL} target="_blank" rel="noreferrer" className="pl-play-link">
              <img
                src="/potluck/play2.webp"
                alt="Get Potluck on Google Play"
                className="pl-play-badge"
                width="440"
                height="121"
                loading="eager"
                decoding="async"
              />
            </a>
          </div>
        </section>

        {/* ── How it works ─────────────────────────────────────────────── */}
        <section className="pl-section">
          <div className="pl-container">
            <span className="pl-eyebrow">How it works</span>
            <h2 className="pl-h2">Three taps from hungry to cooking.</h2>
            <div className="pl-steps">
              {STEPS.map((s) => (
                <div className="pl-step" key={s.title}>
                  <div className="pl-step-badge">
                    {typeof s.badge === 'object'
                      ? <img
                          src={s.badge.img}
                          alt={s.badge.alt}
                          width="160"
                          height="160"
                          loading="lazy"
                          decoding="async"
                        />
                      : <span>{s.badge}</span>}
                  </div>
                  <h3>{s.title}</h3>
                  <p>{s.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Personality strip ────────────────────────────────────────── */}
        <section className="pl-section pl-voice">
          <div className="pl-container pl-voice-inner">
            <span className="pl-dots"><span /><span /><span /></span>
            <p className="pl-voice-quote">
              The universe has spoken. <span className="gold">Argue with it later.</span>
            </p>
            <p className="pl-voice-sub">
              Potluck has a mouth on it. Every spin lands with a verdict —
              sometimes cheeky, sometimes uncanny, always final.
            </p>
            <div className="pl-verdicts">
              {VERDICTS.map((v) => <span className="pl-verdict" key={v}>{v}</span>)}
            </div>
          </div>
        </section>

        {/* ── The Void ─────────────────────────────────────────────────── */}
        <section className="pl-section pl-void">
          <div className="pl-void-grain" aria-hidden="true" />
          <div className="pl-container pl-void-inner">
            <span className="pl-void-glyph" aria-hidden="true">⌀</span>
            <span className="pl-eyebrow pl-eyebrow--void">The Void</span>
            <h2 className="pl-h2 pl-void-title">Some recipes should never return.</h2>
            <p className="pl-void-lead">
              Didn&rsquo;t like what landed? Banish it. One swipe and it&rsquo;s
              gone &mdash; erased from the wheel, struck from the record,
              cast into the Void where no recipe can hurt you again.
            </p>
            <p className="pl-void-fine">
              This is permanent. The universe does not appreciate being
              second-guessed. Banished recipes are gone for good and the
              wheel will never speak of them again.
            </p>
            <div className="pl-void-whisper">
              <p>
                (There is a door at the back of the Void. We are not
                supposed to tell you about it. If you find it, that&rsquo;s
                between you and the universe.)
              </p>
            </div>
          </div>
        </section>

        {/* ── Potluck × Savor ──────────────────────────────────────────── */}
        <section className="pl-section">
          <div className="pl-container pl-pair-inner">
            <div className="pl-pair">
              <span className="pl-eyebrow">Better together</span>
              <h2 className="pl-h2">Potluck decides. Savor keeps it.</h2>
              <p>
                <strong>Potluck</strong> is the fastest answer to “what’s for dinner?” —
                a single spin and you’re cooking. <strong>Savor</strong> is where the keepers live:
                the recipes you loved, saved and organised and ad-free. Every spin you fall for
                is one tap away from your Savor collection.
              </p>
              <Link to="/" className="pl-btn pl-btn--teal">Meet Savor →</Link>
            </div>
            <div className="pl-pair-icons">
              <img
                src="/potluck/potluck-icon.webp"
                alt="Potluck"
                className="pl-pair-icon"
                width="192"
                height="192"
                loading="lazy"
                decoding="async"
              />
              <span className="pl-pair-x">×</span>
              <img
                src="/icons/icon-Tangerine.webp"
                alt="Savor"
                className="pl-pair-icon"
                width="160"
                height="160"
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        {/* ── Download band ────────────────────────────────────────────── */}
        <section className="pl-download">
          <div className="pl-container pl-section pl-download-inner">
            <h2>Spin for your supper.</h2>
            <a href={PLAY_URL} target="_blank" rel="noreferrer" className="pl-play-link">
              <img
                src="/potluck/play2.webp"
                alt="Get Potluck on Google Play"
                className="pl-play-badge"
                width="440"
                height="121"
                loading="lazy"
                decoding="async"
              />
            </a>
          </div>
        </section>

      </main>
      <Footer />
    </>
  )
}