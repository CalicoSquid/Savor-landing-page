// src/pages/Studio.jsx
import './Studio.css'

const SERVICES = [
    { icon: '📱', title: 'React Native', desc: 'Cross-platform mobile apps built for Android. Expo, EAS, Play Store deploy.' },
    { icon: '⚙️', title: 'Backend & API', desc: 'Node.js, GraphQL, MongoDB. Scalable backends that ship with the app.' },
    { icon: '🎨', title: 'UI & Design Systems', desc: 'Theming, component libraries, pixel-perfect interfaces that feel native.' },
    { icon: '🚀', title: 'End-to-End', desc: 'Auth, payments, push notifications, analytics. Solo or team, I ship.' },
]

export default function Studio() {
    return (
        <main className="page studio-page">

            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="studio-hero">
                <div className="container studio-hero-content">
                    <p className="studio-hero-eyebrow fade-up fade-up-2">Available for freelance</p>
                    <h1 className="studio-hero-title fade-up fade-up-3">
                        I build apps<br />
                        <span className="studio-hero-accent">people actually use.</span>
                    </h1>
                    <p className="studio-hero-sub fade-up fade-up-4">
                        Former professional chef turned React Native developer.
                        I bring a decade of high-pressure kitchen discipline to every build.
                    </p>
                    <div className="studio-hero-ctas fade-up fade-up-4">
                        {/* TODO: replace href with email or contact form */}
                        <a href="#cta" className="studio-btn-primary">Get in touch</a>                    </div>
                </div>
                <div className="studio-hero-scroll-hint">scroll</div>
            </section>

            {/* ── Services ───────────────────────────────────────────── */}
            <section className="studio-services">
                <div className="container">
                    <p className="studio-overline">What I do</p>
                    <h2 className="studio-section-title">Mobile-first.<br />Production-ready.</h2>
                    <div className="services-grid">
                        {SERVICES.map((s) => (
                            <div className="service-card" key={s.title}>
                                <span className="service-icon">{s.icon}</span>
                                <h3 className="service-title">{s.title}</h3>
                                <p className="service-desc">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Story ──────────────────────────────────────────────── */}
            <section className="studio-story">
                <div className="container studio-story-inner">
                    <div className="story-quote-wrap">
                        <span className="story-quote-mark">"</span>
                        <blockquote className="story-quote">
                            A decade in professional kitchens taught me more about shipping under pressure than any bootcamp could.
                        </blockquote>
                    </div>
                    <div className="story-body">
                        <p className="story-overline">The story</p>
                        <p className="story-text">I spent years as a professional chef before making the jump to software. Turns out the discipline, the precision, and the obsession with every plate carries over to every pixel.</p>
                        <p className="story-text">Mise en place doesn't stop at the kitchen. CalicoSquid Code is where I build things I actually want to exist. Solo dev, nights and weekends, full-time cat supervisor.</p>
                        <div className="story-stack">
                            <span className="stack-pill">React Native</span>
                            <span className="stack-pill">Expo</span>
                            <span className="stack-pill">TypeScript</span>
                            <span className="stack-pill">PostgreSQL</span>
                            <span className="stack-pill">Node.js</span>
                            <span className="stack-pill">GraphQL</span>
                            <span className="stack-pill">MongoDB</span>
                            <span className="stack-pill">Firebase</span>

                        </div>
                    </div>
                </div>
            </section>

            {/* ── Work ───────────────────────────────────────────────── */}
            <section className="studio-work" id="work">
                <div className="container">
                    <p className="studio-overline">Featured work</p>
                    <h2 className="studio-section-title">Built with intent.</h2>
                    <div className="work-card">
                        <div className="work-card-left">
                            {/* Corrected: Using the inverted Savor wordmark */}
                            <img src="/images/Savor_white.png" alt="Savor" className="work-wordmark" />
                            <p className="work-tag">React Native · Android · 2026</p>
                            <p className="work-desc">A full-stack recipe management app built for people who actually cook. Scrape any recipe URL, scan a physical cookbook with OCR, or type one in yourself — all in one place. 12 fruit themes, community feed, Pro tier, Railway backend.</p>                            <div className="work-links">
                                <a href="/" className="studio-btn-primary">View app →</a>
                            </div>
                        </div>
                        <div className="work-card-right">
                            <img src="/images/ssss.png" alt="Savor app" className="work-screenshot" />
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ────────────────────────────────────────────────── */}
            <section className="studio-cta" id="cta">
                <div className="studio-cta-bg" />
                <div className="container studio-cta-inner">
                    <img src="/images/logo_W.png" alt="" className="cta-squid" aria-hidden="true" />
                    <h2 className="cta-title">Let's build something.</h2>
                    <p className="cta-sub">Got an app idea? Need a React Native dev who ships? Let's talk.</p>
                    <div className="studio-hero-ctas">
                        <a href="mailto:calicoSquidCode@gmail.com" className="studio-btn-primary">Get in touch</a>
                        <a href="https://buymeacoffee.com/calicosquid" className="studio-btn-ghost" target="_blank" rel="noreferrer">Buy me a coffee</a>
                    </div>
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────────── */}
            <footer className="studio-footer">
                <div className="container studio-footer-inner">
                    <span className="studio-footer-name">
                        calicoSquid<span className="studio-footer-orange">Code</span>
                    </span>
                </div>
            </footer>

        </main >
    )
}