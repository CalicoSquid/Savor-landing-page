import './savor.css'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'
import Footer from '../components/Footer'

const PILLARS = [
    {
        title: 'Discover.',
        img: '/screenshots/found.webp',
        bg: 'linear-gradient(135deg, #303F9F, #5C6BC0)',
        sub: <>Savor's built-in browser spots recipes as you browse. One tap and it's saved properly — the photo, the ingredients, the steps. No copying, no pasting, no twelve paragraphs about the author's holiday in Tuscany. Join the <strong>war against scrolling</strong>, one tap at a time.</>,
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
                <img
                    src={getIcon(theme.name)}
                    alt={theme.name}
                    className="theme-card-icon"
                    width="160"
                    height="160"
                    loading="lazy"
                    decoding="async"
                />
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
                    <img
                        src="/images/Savor.webp"
                        alt="Savor"
                        className="hero-wordmark fade-up fade-up-1"
                        width="840"
                        height="263"
                        loading="eager"
                        decoding="async"
                        fetchPriority="high"
                    />
                    <h1 className="hero-tagline fade-up fade-up-2">
                        Recipes fade.<br />
                        <span style={{ color: 'var(--primary)' }}>Savor doesn&rsquo;t.</span>
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

                        I built this because I thought it was cool. Because I wanted to build something
                        I liked. And because even though I've long since retired my chef whites, I still
                        cook. A lot. I thought it'd be fun to make somewhere people like me could find
                        things worth cooking, and pass them on.
                    </p>

                    <p className="hero-sub fade-up fade-up-3">
                        So that's what I did.
                    </p>

                    <p className="hero-sub fade-up fade-up-3">
                        Have a look if you fancy it. If not &mdash; I've had a good time building it, and
                        my mum told me it's amazing (and that I'm very handsome), so that's fine too.
                        🧡
                    </p>
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
                            <img
                                src="/screenshots/savor-scan.webp"
                                srcSet="/screenshots/savor-scan-640.webp 640w, /screenshots/savor-scan.webp 1000w"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                alt="A 1982 handwritten recipe card for Aunt Maja's lemon drizzle cake next to the same recipe saved in Savor"
                                className="feature-row-photo"
                                width="1000"
                                height="1000"
                                loading="lazy"
                                decoding="async"
                            />
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
                                <img
                                    src={p.img}
                                    srcSet={`${p.img.replace('.webp', '-240.webp')} 240w, ${p.img} 480w`}
                                    sizes="(max-width: 900px) 200px, 188px"
                                    alt={p.title}
                                    width="480"
                                    height="1002"
                                    loading="lazy"
                                    decoding="async"
                                />
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
                    <h2 className="same-kitchen-title">More from the same kitchen.</h2>
                    <p className="same-kitchen-sub">
                        Savor comes from a one-person kitchen, not a studio. Two are already in testing. One more is creeping into view.
                    </p>
                    <div className="same-kitchen-apps">
                        <div className="same-kitchen-app">
                            <img
                                src="/potluck/potluck-icon.webp"
                                alt="Potluck"
                                className="same-kitchen-app-icon"
                                width="192"
                                height="192"
                                loading="lazy"
                                decoding="async"
                            />
                            <h3>Potluck</h3>
                            <p>One spin and the universe decides what&rsquo;s for dinner — no scrolling, no deciding, just turn the oven on. It&rsquo;s basically a fun excuse to pull you into Savor, and it knows it.</p>
                            <div className="same-kitchen-app-links">
                                <a href="/potluck" className="same-kitchen-app-link">See Potluck →</a>
                                <a href="https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck"
                                    target="_blank" rel="noreferrer"
                                    className="same-kitchen-app-link same-kitchen-app-link--muted">Join the test</a>
                            </div>
                        </div>
                        <div className="same-kitchen-app">
                            <img
                                src="/caper/caper-icon.webp"
                                alt="Caper"
                                className="same-kitchen-app-icon"
                                width="160"
                                height="160"
                                loading="lazy"
                                decoding="async"
                            />
                            <h3>Caper</h3>
                            <p>A wild foraging companion — find and identify what&rsquo;s edible nearby, then learn to cook it safely. Comes with a set of cute, boy-scout-style badges to earn along the way.</p>
                            <div className="same-kitchen-app-links">
                                <a href="/caper" className="same-kitchen-app-link">See Caper →</a>
                                <a href="https://play.google.com/store/apps/details?id=com.calicosquid.forage"
                                    target="_blank" rel="noreferrer"
                                    className="same-kitchen-app-link same-kitchen-app-link--muted">Join the test</a>
                            </div>
                        </div>
                        <div className="same-kitchen-app same-kitchen-app--apocaleaf">
                            <div className="apoc-teaser">
                                <div className="apoc-teaser-grid" aria-hidden="true" />
                                <span className="apoc-teaser-stamp">Coming soon</span>
                                <div className="apoc-teaser-lockup" aria-hidden="true">
                                    <img
                                        src="/apocaleaf/famine-approval-ring.webp"
                                        alt=""
                                        className="apoc-teaser-ring"
                                        width="512"
                                        height="512"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                    <img
                                        src="/apocaleaf/standard-issue-splash.webp"
                                        alt=""
                                        className="apoc-teaser-seal"
                                        width="256"
                                        height="256"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                <span className="apoc-teaser-agency">F.A.M.I.N.E. // Field Archive</span>
                                <h3 className="apoc-teaser-title">Apocaleaf</h3>
                                <span className="apoc-teaser-tag">Forage the ruins. File the report. Eat well.</span>
                            </div>
                            <p>A post-apocalyptic foraging game disguised as a field file. Track edible plants, file your findings, earn collection cards, and build a survival archive from the wreckage.</p>
                            <div className="same-kitchen-app-links">
                                <a href="/apocaleaf" className="same-kitchen-app-link">Open field file →</a>
                                <span className="same-kitchen-app-soon">Not in testing yet</span>
                            </div>
                        </div>
                    </div>
                    <p className="same-kitchen-disclaimer">
                        Potluck and Caper are in closed testing on Google Play. Email <a href="mailto:dev@getsavor.recipes">dev@getsavor.recipes</a> to be added as a tester. Apocaleaf is still cooking.
                    </p>
                </div>
            </section>

            {/* ── Download CTA ───────────────────────────────────────── */}
            <section className="download-cta" id="download">
                <div className="download-cta-bg" style={{ background: `linear-gradient(135deg, ${activeTheme.gradient[0]}18, ${activeTheme.gradient[1]}18)` }} />
                <div className="container download-cta-inner">
                    <img
                        src={getIcon(activeTheme.name)}
                        alt="Savor"
                        className="download-cta-icon"
                        width="160"
                        height="160"
                        loading="lazy"
                        decoding="async"
                    />
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
                        <img
                            src="/potluck/play2.webp"
                            alt="Get it on Google Play"
                            className="download-play-badge"
                            width="440"
                            height="121"
                            loading="lazy"
                            decoding="async"
                        />
                    </a>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <Footer />

        </main >
    )
}