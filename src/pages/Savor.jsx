import './savor.css'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'
import AccessGate from '../components/AccessGate'
import { useState, useRef } from 'react'

const SCREENSHOTS = [
    { file: '/screenshots/watermelon.png', title: 'Snap to Save', sub: 'Point your camera at any cookbook page. Savor reads it, structures it, saves it. No typing.', bg: 'linear-gradient(135deg, #C62828, #FF4081)' },
    { file: '/screenshots/blueberry.png', title: 'Just One Tap', sub: 'Browse the web inside the app. Find a recipe you love, hit import — it\'s yours forever.', bg: 'linear-gradient(135deg, #303F9F, #5C6BC0)' },
    { file: '/screenshots/dragonfruit.png', title: 'Just The Recipe', sub: 'No life stories. No ads. No scroll. Savor strips every recipe down to what you actually need.', bg: 'linear-gradient(135deg, #AD1457, #FF1493)' },
    { file: '/screenshots/lime.png', title: 'Share the Love', sub: 'Post to the community feed. See what the world is cooking. Save anything that looks good.', bg: 'linear-gradient(135deg, #8BC34A, #689F38)' },
]

const PILLARS = [
    { title: 'Save any recipe.', sub: 'URL, photo, text. If it\'s a recipe, Savor can save it.' },
    { title: 'Skip the blog.', sub: 'We strip the ads, the life story, the pop-ups. Just ingredients and steps.' },
    { title: 'Cook together.', sub: 'Share to the community feed. Discover what everyone else is making.' },
]

function ThemeCard({ theme, active, onSelect }) {
    return (
        <button
            className={`theme-card ${active ? 'theme-card--active' : ''}`}
            onClick={() => onSelect(theme)}
            style={active ? { borderColor: theme.primary } : {}}
        >
            <div className="theme-card-swatch" style={{ background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})` }}>
                <div className="theme-card-dots">
                    <span className="theme-dot" style={{ background: theme.primary }} />
                    <span className="theme-dot" style={{ background: theme.secondary }} />
                    <span className="theme-dot" style={{ background: theme.tertiary }} />
                </div>
                {active && <span className="theme-card-check">&#10003;</span>}
            </div>
            <div className="theme-card-label">
                <img src={getIcon(theme.name)} alt={theme.name} className="theme-card-icon" />
                <span className="theme-card-name">{theme.name}</span>
            </div>
        </button>
    )
}

export default function Savor() {
    const { activeTheme, setActiveTheme, themes } = useTheme()
    const featuresRef = useRef(null)
    const [activeSlide, setActiveSlide] = useState(0)

    function handleFeaturesScroll() {
        const el = featuresRef.current
        if (!el) return
        const index = Math.round(el.scrollLeft / el.offsetWidth)
        setActiveSlide(index)
    }

    console.log('Active theme:', activeTheme)

    return (
        <main className="page savor-page">

            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="hero">
                <div className="hero-glow" style={{ background: `radial-gradient(ellipse at 50% 60%, ${activeTheme.primary}22 0%, transparent 70%)` }} />
                <div className="container hero-inner">
                    <span className="beta-badge fade-up fade-up-1">Beta — Android</span>
                    <img src="/images/Savor.png" alt="Savor" className="hero-wordmark fade-up fade-up-2" />
                    <p className="hero-tagline fade-up fade-up-3">
                        <span style={{ color: 'var(--primary)' }}>Cook</span>{' '}
                        <span style={{ color: 'var(--secondary)' }}>in</span>{' '}
                        <span style={{ color: 'var(--tertiary)' }}>Color.</span>
                    </p>
                    <p className="hero-sub fade-up fade-up-3">
                        Save any recipe, from anywhere. Paste a URL, scan a cookbook page, or type in grandma's secret — Savor handles all of it.


                    </p>
                    <div className="action-row fade-up fade-up-4">
                        <a href="#beta" className="btn btn-green">Get the App</a>
                        <a href="https://docs.google.com/forms/d/e/1FAIpQLSfzqEdHxV0QKyhhWZ7zWLT5qUZWZAU2QwIt4PWuSoUrjkN-DQ/viewform" className="btn btn-fruit" target="_blank" rel="noreferrer">Leave Feedback</a>                        <a href="#flavors" className="btn btn-tertiary">Pick Your Flavor</a>
                        <a href="/studio" className="btn btn-dark">calicoSquid<span className="footer-csc-code">Code</span></a>
                    </div>
                </div>
            </section>

            {/* ── Pillars ─────────────────────────────────────────────── */}
            <section className="pillars">
                <div className="container pillars-grid">
                    {PILLARS.map((p) => (
                        <div className="pillar" key={p.title}>
                            <div className="pillar-rule" style={{ background: 'var(--grad-fruit)' }} />
                            <h3 className="pillar-title">{p.title}</h3>
                            <p className="pillar-sub">{p.sub}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Features ───────────────────────────────────────────── */}
            {/* ── Features ───────────────────────────────────────────── */}
            <section className="features" ref={featuresRef} onScroll={handleFeaturesScroll}>
                {SCREENSHOTS.map((s, i) => (
                    <div className={`feature-row ${i % 2 === 1 ? 'feature-row--reverse' : ''}`} key={s.file}>
                        <div className="feature-row-img" style={{ background: s.bg }}>
                            <img src={s.file} alt={s.title} className="feature-row-screenshot" />
                        </div>
                        <div className="feature-row-text">
                            <div className="feature-overline" style={{ background: 'var(--grad-fruit)' }} />
                            <h3 className="feature-row-title">{s.title}</h3>
                            <p className="feature-row-sub">{s.sub}</p>
                        </div>
                    </div>
                ))}
            </section>
            <div className="features-dots">
                {SCREENSHOTS.map((_, i) => (
                    <span key={i} className={`features-dot ${i === activeSlide ? 'features-dot--active' : ''}`} />
                ))}
            </div>

            {/* ── Pick Your Flavor ───────────────────────────────────── */}
            <section className="flavors" id="flavors">
                <div className="flavors-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${activeTheme.primary}30 0%, transparent 60%)` }} />
                <div className="container flavors-inner">
                    <p className="flavors-overline">12 fruit themes</p>
                    <h2 className="flavors-title">Cook in Color.</h2>
                    <p className="flavors-sub">
                        Pick a theme — the whole app wears it.
                        This is what it looks like in your hands.
                    </p>
                    <div className="flavors-grid">
                        {themes.map((t) => (
                            <ThemeCard key={t.name} theme={t} active={activeTheme.name === t.name} onSelect={setActiveTheme} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Beta CTA ───────────────────────────────────────────── */}
            <section className="beta-cta" id="beta">
                <div className="beta-cta-bg" style={{ background: `linear-gradient(135deg, ${activeTheme.gradient[0]}18, ${activeTheme.gradient[1]}18)` }} />
                <div className="container beta-cta-inner">
                    <img src={getIcon(activeTheme.name)} alt="Savor" className="beta-cta-icon" />
                    <p className="beta-cta-overline">You're early</p>
                    <h2 className="beta-cta-title">That's a good thing.</h2>
                    <p className="beta-cta-sub">
                        Savor is in beta and your feedback shapes what ships.
                        Download the APK, cook something, and tell me what's broken.
                    </p>
                    <div className="action-row">
                        <AccessGate >
                            <a href="https://github.com/CalicoSquid/SavorAndroid/releases/tag/v0.1.0-beta"
                                className="btn btn-green shimmer"
                                target="_blank"
                                rel="noreferrer">
                                Download APK
                            </a>
                        </AccessGate>
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <footer className="footer">
                <div className="container footer-inner">
                    <span className="footer-copy">

                        <a href="/studio" className="footer-csc-link">
                            calicoSquid<span className="footer-csc-code">Code</span>
                        </a>
                    </span>
                </div>
            </footer>

        </main >
    )
}