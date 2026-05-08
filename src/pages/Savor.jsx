import './savor.css'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'
import { useRef } from 'react'

const SCREENSHOTS = [
    { file: '/screenshots/scan.png', title: 'Snap to Save', sub: 'Point your camera at any cookbook page. Savor reads it, structures it, saves it. No typing.', bg: 'linear-gradient(135deg, #C62828, #FF4081)' },
    { file: '/screenshots/found.png', title: 'Just One Tap', sub: 'Browse the web inside the app. Find a recipe you love, hit import — it\'s yours forever.', bg: 'linear-gradient(135deg, #303F9F, #5C6BC0)' },
    { file: '/screenshots/recipe.png', title: 'Just The Recipe', sub: 'No life stories. No ads. No scroll. Savor strips every recipe down to what you actually need.', bg: 'linear-gradient(135deg, #AD1457, #FF1493)' },
    { file: '/screenshots/community.png', title: 'Share the Love', sub: 'Post to the community feed. See what the world is cooking. Save anything that looks good.', bg: 'linear-gradient(135deg, #8BC34A, #689F38)' },
]


const PILLARS = [
    {
        title: 'Discover.',
        sub: 'Savor\'s built-in browser spots recipes as you browse. One tap and it\'s saved properly — the photo, the ingredients, the steps. No copying, no pasting, no twelve paragraphs about the author\'s holiday in Tuscany.'
    },
    {
        title: 'Preserve.',
        sub: 'Got a drawer full of handwritten cards or a battered old cookbook? Point your camera at them. Savor reads the writing, rebuilds the recipe, even finds an image when there isn\'t one. Recipes that nearly disappeared, brought back to life.'
    },
    {
        title: 'Imagine.',
        sub: 'Got a recipe rattling around in your head? Type it out, however roughly. Savor turns it into a real recipe card you can actually cook from.'
    },
    {
        title: 'Together.',
        sub: 'A calm, algorithm-free feed of people who actually love food. No viral five-second reels. No endless smash cuts. Just cooks sharing what they made for lunch today.'
    },
]


function ThemeCard({ theme, active, onSelect }) {
    return (
        <button
            className={`theme-card ${active ? 'theme-card--active' : ''}`}
            onClick={(e) => onSelect(theme, e)}
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
    const { activeTheme, selectTheme, themes } = useTheme()
    const featuresRef = useRef(null)

    return (
        <main className="page savor-page">

            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="hero">
                <div className="hero-glow" style={{ background: `radial-gradient(ellipse at 50% 60%, ${activeTheme.primary}22 0%, transparent 70%)` }} />
                <div className="container hero-inner">
                    <img src="/images/Savor.png" alt="Savor" className="hero-wordmark fade-up fade-up-1" />
                    <p className="hero-tagline fade-up fade-up-2">
                        <span style={{ color: 'var(--primary)' }}>Cook</span>{' '}
                        <span style={{ color: 'var(--dark)' }}>in</span>{' '}
                        <span style={{ color: 'var(--tertiary)' }}>Color.</span>
                    </p>
                    <p className="hero-sub fade-up fade-up-3">
                        Browse the web, scan a recipe card or type in Grandmas secret.
                        A recipe app made by a chef who got tired of recipe apps. Built around the things that made me fall in love with cooking in the first place.</p>
                    <div className="hero-cta-row fade-up fade-up-4">
                        <a href="https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes" className="btn btn-green" target="_blank" rel="noreferrer">Get the App</a>
                        <a href="#flavors" className="btn btn-tertiary">Pick Your Flavor</a>
                        <a href="/potluck" className="btn btn-fruit">Spin for Your Supper</a>                        <a href="/studio" className="btn btn-dark">calicoSquid<span className="footer-csc-code">Code</span></a>
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
            <section className="features" ref={featuresRef}>
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
                            <ThemeCard key={t.name} theme={t} active={activeTheme.name === t.name} onSelect={selectTheme} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Download CTA ───────────────────────────────────────── */}
            <section className="download-cta" id="download">
                <div className="download-cta-bg" style={{ background: `linear-gradient(135deg, ${activeTheme.gradient[0]}18, ${activeTheme.gradient[1]}18)` }} />
                <div className="container download-cta-inner">
                    <img src={getIcon(activeTheme.name)} alt="Savor" className="download-cta-icon" />
                    <h2 className="download-cta-title">A home for every recipe that matters.</h2>
                    <p className="download-cta-sub">
                        I started Savor the day I found my mum's old recipe cards. Tattered, smudged, stained — but still meaning the world to me. That's what Savor is now. A place worthy of them.
                    </p>
                    <a
                        href="https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes"
                        target="_blank"
                        rel="noreferrer"
                        className="download-play-link"
                    >
                        <img src="/potluck/play2.png" alt="Get it on Google Play" className="download-play-badge" />
                    </a>
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