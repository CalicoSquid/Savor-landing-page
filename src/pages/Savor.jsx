import './savor.css'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'
import Footer from '../components/Footer'

const PILLARS = [
    {
        title: 'Discover.',
        img: '/screenshots/found.webp',
        bg: 'linear-gradient(135deg, #303F9F, #5C6BC0)',
        sub: 'Savor\'s built-in browser spots recipes as you browse. One tap and it\'s saved properly — the photo, the ingredients, the steps. No copying, no pasting, no twelve paragraphs about the author\'s holiday in Tuscany.',
        cta: { label: 'Try it on a fake food blog we wrote just to prove it →', href: '/demo' }
    },
    {
        title: 'Imagine.',
        img: '/screenshots/recipe.webp',
        bg: 'linear-gradient(135deg, #AD1457, #FF1493)',
        sub: 'Got a recipe rattling around in your head? Type it out, however roughly. Savor turns it into a real recipe card you can actually cook from.'
    },
    {
        title: 'Together.',
        img: '/screenshots/community.webp',
        bg: 'linear-gradient(135deg, #8BC34A, #689F38)',
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

    return (
        <main className="page savor-page">

            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="hero">
                <div className="hero-glow" style={{ background: `radial-gradient(ellipse at 50% 60%, ${activeTheme.primary}22 0%, transparent 70%)` }} />
                <div className="container hero-inner">
                    <img src="/images/Savor.webp" alt="Savor" className="hero-wordmark fade-up fade-up-1" />
                    <h1 className="hero-tagline fade-up fade-up-2">
                        Join the war against <span style={{ color: 'var(--primary)' }}>scrolling.</span>
                    </h1>
                    <div className="hero-colorstrip fade-up fade-up-2" aria-hidden="true">
                        {themes.map((t, i) => (
                            <span
                                key={t.name}
                                className="hero-colorstrip-seg"
                                style={{ background: t.primary, animationDelay: `${i * 45}ms` }}
                            />
                        ))}
                    </div>
                    <p className="hero-sub fade-up fade-up-3">
                        Point your camera at a handwritten recipe card or a page from an old cookbook, and Savor rebuilds it into something you can actually cook from. Or import any recipe from the web in one tap. Made by a professional chef who got tired of recipe apps.</p>
                    <div className="hero-cta-row fade-up fade-up-4">
                        <a href="https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes" className="btn btn-fruit" target="_blank" rel="noreferrer">Get the App</a>
                        <a href="#preserve" className="hero-secondary-link">See how it started ↓</a>
                    </div>
                </div>
            </section>

            {/* ── Name disambiguation ─────────────────────────────────── */}
            <section className="name-note">
                <div className="container">
                    <p className="name-note-text">
                        <strong>Quick note:</strong> there are a few apps out there called Savor. This is the one with a recipe scanner for handwritten cards, zero ads, and no algorithm — built solo by a chef, on a farm in Montenegro.
                    </p>
                </div>
            </section>

            {/* ── Flagship: Preserve (merged with the origin story) ──── */}
            <section className="features" id="preserve">
                <div className="container">
                    <div className="feature-row">
                        <div className="feature-row-img feature-row-img--photo">
                            <img src="/screenshots/savor-scan.webp" alt="A 1982 handwritten recipe card for Aunt Maja's lemon drizzle cake next to the same recipe saved in Savor" className="feature-row-photo" />
                        </div>
                        <div className="feature-row-text">
                            <div className="feature-overline" style={{ background: 'var(--grad-fruit)' }} />
                            <p style={{ fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-muted)' }}>Where Savor started</p>
                            <h2 className="feature-row-title">Preserve.</h2>
                            <p className="feature-row-sub">
                                I started Savor the day I found my mum&rsquo;s old recipe cards — tattered, smudged, and still the most important recipes I own. Point your camera at handwriting like that, or a page from a battered cookbook, and Savor reads it, rebuilds the recipe, and even finds a photo when there isn&rsquo;t one. Recipes that were one spill away from disappearing — saved properly, at last.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pillars (with merged screenshots) ──────────────────── */}
            <section className="pillars">
                <div className="container pillars-grid">
                    {PILLARS.map((p) => (
                        <div className="pillar" key={p.title}>
                            <div className="pillar-shot" style={{ background: p.bg }}>
                                <img src={p.img} alt={p.title} />
                            </div>
                            <div className="pillar-rule" style={{ background: 'var(--grad-fruit)' }} />
                            <h3 className="pillar-title">{p.title}</h3>
                            <p className="pillar-sub">{p.sub}</p>
                            {p.cta && <a href={p.cta.href} className="pillar-cta">{p.cta.label}</a>}
                        </div>
                    ))}
                </div>
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

            {/* ── From the same kitchen ───────────────────────────────── */}
            <section className="same-kitchen">
                <div className="container same-kitchen-inner">
                    <p className="same-kitchen-eyebrow">From the same kitchen</p>
                    <h2 className="same-kitchen-title">Two more, still in testing.</h2>
                    <p className="same-kitchen-sub">
                        Savor comes from a one-person kitchen, not a studio. These are next.
                    </p>
                    <div className="same-kitchen-apps">
                        <div className="same-kitchen-app">
                            <img src="/potluck/potluck-icon.webp" alt="Potluck" className="same-kitchen-app-icon" />
                            <h3>Potluck</h3>
                            <p>One spin and the universe decides what&rsquo;s for dinner — no scrolling, no deciding, just turn the oven on. It&rsquo;s basically a fun excuse to pull you into Savor, and it knows it.</p>
                            <a
                                href="https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck"
                                target="_blank"
                                rel="noreferrer"
                                className="same-kitchen-app-link"
                            >
                                Join the test →
                            </a>
                        </div>
                        <div className="same-kitchen-app">
                            <img src="/forage/forage-icon-bg.webp" alt="Forage" className="same-kitchen-app-icon" />
                            <h3>Forage</h3>
                            <p>A wild foraging companion — find and identify what&rsquo;s edible nearby, then learn to cook it safely. Comes with a set of cute, boy-scout-style badges to earn along the way.</p>
                            <a
                                href="https://play.google.com/store/apps/details?id=com.calicosquid.forage"
                                target="_blank"
                                rel="noreferrer"
                                className="same-kitchen-app-link"
                            >
                                Join the test →
                            </a>
                        </div>
                    </div>
                    <p className="same-kitchen-disclaimer">
                        Both are in closed testing on Google Play. Email <a href="mailto:dev@getsavor.recipes">dev@getsavor.recipes</a> to be added as a tester.
                    </p>
                </div>
            </section>

            {/* ── Download CTA ───────────────────────────────────────── */}
            <section className="download-cta" id="download">
                <div className="download-cta-bg" style={{ background: `linear-gradient(135deg, ${activeTheme.gradient[0]}18, ${activeTheme.gradient[1]}18)` }} />
                <div className="container download-cta-inner">
                    <img src={getIcon(activeTheme.name)} alt="Savor" className="download-cta-icon" />
                    <h2 className="download-cta-title">A home for every recipe that matters.</h2>
                    <p className="download-cta-sub">
                        Free to start. No ads, ever. Available now on Android.
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
            <Footer />

        </main >
    )
}