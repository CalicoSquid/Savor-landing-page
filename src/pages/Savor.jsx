import './savor.css'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'
import Footer from '../components/Footer'
import { TOOL_PAGE_BY_ID } from '../data/toolPages'

const PILLARS = [
    {
        title: 'Discover.',
        img: '/screenshots/found.webp',
        alt: 'Savor detecting a recipe on a website for one-tap import',
        bg: 'linear-gradient(135deg, #303F9F, #5C6BC0)',
        sub: <>Savor's built-in browser spots recipes as you browse. One tap and it's saved properly — the photo, the ingredients, the steps. No copying, no pasting, no twelve paragraphs about the author's holiday in Tuscany. Join the <strong>war against scrolling</strong>, one tap at a time.</>,
        cta: { label: 'Try it on a fake food blog we wrote just to prove it →', href: '/demo/' }
    },
    {
        title: 'Imagine.',
        img: '/screenshots/recipe.webp',
        alt: 'A clean Savor recipe card created from a rough recipe idea',
        bg: 'linear-gradient(135deg, #AD1457, #FF1493)',
        sub: 'Got a recipe rattling around in your head? Type it out, however roughly. Savor turns it into a real recipe card you can actually cook from.'
    },
    {
        title: 'Together.',
        img: '/screenshots/community.webp',
        alt: 'Savor’s calm, algorithm-free community recipe feed',
        bg: 'linear-gradient(135deg, #8BC34A, #689F38)',
        sub: 'A calm, algorithm-free feed of people who actually love food. No viral five-second reels. No endless smash cuts. Just cooks sharing what they made for lunch today.'
    },
]

const FEATURED_TOOLS = [
    TOOL_PAGE_BY_ID['recipe-scaler'],
    TOOL_PAGE_BY_ID['measurement-converter'],
    TOOL_PAGE_BY_ID['pan-converter'],
    TOOL_PAGE_BY_ID['potluck'],
]


function ThemeCard({ theme, active, onSelect }) {
    return (
        <button type="button" className={`theme-card ${active ? 'theme-card--active' : ''}`}
            aria-pressed={active} aria-label={`Use ${theme.name} theme`}
            onClick={(event) => onSelect(theme, event)}
            style={{ borderColor: active ? theme.primary : undefined }}>
            <img src={getIcon(theme.name)} alt="" width="32" height="32" loading="lazy" decoding="async" />
            <span>{theme.name}</span>
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
                    <p className="hero-kitchen-intro fade-up fade-up-2">Recipes, useful tools, and a little kitchen confidence.</p>
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
                    <p className="hero-sub hero-sub--definition fade-up fade-up-3">
                        Save recipes from websites, screenshots, cookbook pages and handwritten cards — then keep them as clean, cookable recipe cards in one colorful place.
                    </p>
                    <div className="hero-cta-row fade-up fade-up-4">
                        <a href="#kitchen" className="btn btn-fruit">Explore the kitchen</a>
                        <a href="https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes" className="hero-secondary-link" target="_blank" rel="noreferrer">Get the Savor app &rarr;</a>
                        <a href="#preserve" className="hero-secondary-link">The story behind the app ↓</a>
                    </div>
                </div>
            </section>

            <section className="home-tools" aria-labelledby="home-tools-title">
                <div className="container home-tools-inner">
                    <div className="home-tools-heading">
                        <div>
                            <p className="home-tools-eyebrow">Free kitchen tools</p>
                            <h2 id="home-tools-title">The annoying kitchen problems drawer.</h2>
                        </div>
                        <p>
                            Scale a recipe, convert cups and grams, fit a bake to another pan — or let Potluck decide what you should cook tonight. No account, no ads — just useful answers and enough chef context to use them sensibly.
                        </p>
                    </div>
                    <div className="home-tools-grid">
                        {FEATURED_TOOLS.map((tool) => (
                            <a href={tool.href} className="home-tool-card" key={tool.id}>
                                <span>{tool.category}</span>
                                <strong>{tool.title}</strong>
                                <p>{tool.description}</p>
                                <em>{tool.action} →</em>
                            </a>
                        ))}
                    </div>
                    <a href="/tools/" className="home-tools-all">See all eight free kitchen tools →</a>
                </div>
            </section>

            <section className="same-kitchen" id="kitchen" aria-labelledby="same-kitchen-title">
                <div className="container same-kitchen-inner">
                    <p className="same-kitchen-eyebrow">From the same kitchen</p>
                    <h2 className="same-kitchen-title" id="same-kitchen-title">What&rsquo;s cooking at Savor.</h2>
                    <p className="same-kitchen-sub">
                        Something to cook, a little help choosing, and a few good habits for when you&rsquo;re done.
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
                                <a href="/potluck/" className="same-kitchen-app-link">See Potluck →</a>
                                <a href="https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck"
                                    target="_blank" rel="noreferrer"
                                    className="same-kitchen-app-link same-kitchen-app-link--muted">Get on Google Play</a>
                            </div>
                        </div>
                        <div className="same-kitchen-app">
                            <img src="/blog/smoky-tomato-rice-rustic.jpg" alt="Crisp fried egg over tomato rice and chickpeas" className="same-kitchen-app-icon" width="1200" height="1200" loading="lazy" decoding="async" />
                            <h3>Savor Originals</h3>
                            <p>Original recipes from Caleb&rsquo;s kitchen. Dinner on Autopilot for an ordinary weeknight; Back of the Cupboard for the day you fancy cooking something different.</p>
                            <div className="same-kitchen-app-links">
                                <a href="/originals/" className="same-kitchen-app-link">Find something to cook &rarr;</a>
                            </div>
                        </div>
                        <div className="same-kitchen-app">
                            <svg className="same-kitchen-resource-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="44" height="44" aria-hidden="true">
                                <rect x="6" y="4" width="20" height="25" rx="3" />
                                <path d="M12 4V2h8v2M11 12l2 2 4-4M19 12h3M11 21l2 2 4-4M19 21h3" />
                            </svg>
                            <h3>The kitchen close-down kit</h3>
                            <p>A free printable checklist, leftover labels and fridge reference. Useful food-safety habits from a professional kitchen, without the clipboard-induced panic.</p>
                            <div className="same-kitchen-app-links">
                                <a href="/food-safety-printables/" className="same-kitchen-app-link">Get the free printables &rarr;</a>
                                <a href="/blog/food-safety-lessons-from-a-chef/" className="same-kitchen-app-link same-kitchen-app-link--muted">Read the kitchen story</a>
                            </div>
                        </div>
                    </div>
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
                                I started Savor the day I found my mum&rsquo;s old recipe cards — tattered, smudged, and still the most important recipes I own. Point your camera at handwriting like that, import a photo or screenshot, or scan a page from a battered cookbook, and Savor reads it, rebuilds the recipe, and even finds a photo when there isn&rsquo;t one. Recipes that were one spill away from disappearing — saved properly, at last.
                            </p>
                            <a href="/blog/save-handwritten-recipe-cards/" className="pillar-cta">How to preserve handwritten recipe cards →</a>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Pillars (with merged screenshots) ──────────────────── */}
            <details className="home-app-details">
                <summary>More about the Savor app <span>Import, create and share recipes</span></summary>
            <section className="pillars">
                <div className="container pillars-grid">
                    {PILLARS.map((p) => (
                        <div className="pillar" key={p.title}>
                            <div className="pillar-shot" style={{ background: p.bg }}>
                                <img
                                    src={p.img}
                                    srcSet={`${p.img.replace('.webp', '-240.webp')} 240w, ${p.img} 480w`}
                                    sizes="(max-width: 900px) 200px, 188px"
                                    alt={p.alt}
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
            </details>



            {/* ── Free kitchen tools ────────────────────────────────── */}



            {/* ── Pick Your Flavor ───────────────────────────────────── */}
            <section className="flavors flavors--compact" id="flavors" aria-labelledby="flavors-title">
                <div className="flavors-glow" style={{ background: `radial-gradient(ellipse at 50% 0%, ${activeTheme.primary}30 0%, transparent 60%)` }} />
                <div className="container flavors-inner">
                    <p className="flavors-overline">12 fruit themes</p>
                    <h2 className="flavors-title" id="flavors-title">Cook in Color.</h2>
                    <p className="flavors-sub">
                        A little fruit, a different mood. Pick a colour for this visit.
                    </p>
                    <div className="flavors-grid">
                        {themes.map((t) => (
                            <ThemeCard key={t.name} theme={t} active={activeTheme.name === t.name} onSelect={selectTheme} />
                        ))}
                    </div>
                    <p className="theme-preference-note">
                        <span role="status">Your colour: {activeTheme.name}.</span> Stays with you in this tab.
                        {activeTheme.name !== themes[0].name && <button type="button" onClick={(event) => selectTheme(themes[0], event)}>Back to Tangerine</button>}
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
                    <p className="download-name-note">
                        A few apps share the Savor name. This is the ad-free recipe organiser with the fruit themes, one-tap web imports and handwritten recipe scanning.
                    </p>
                </div>
            </section>


            {/* ── From the same kitchen ───────────────────────────────── */}


            {/* ── Footer ─────────────────────────────────────────────── */}
            <Footer />

        </main >
    )
}
