// src/pages/Studio.jsx
import './Studio.css'

const SERVICES = [
    { icon: '📱', title: 'React Native', desc: 'Android apps built with Expo and EAS. I know the pipeline end to end — dev build to Play Store.' },
    { icon: '⚙️', title: 'Backend & API', desc: 'GraphQL, Node.js, MongoDB. The server side ships with the app, not six weeks after.' },
    { icon: '🎨', title: 'UI & Design', desc: 'I care about how things feel. Pixel-perfect, themed, responsive — no half-finished interfaces.' },
    { icon: '🚀', title: 'The Full Build', desc: 'Auth, subscriptions, push notifications, OCR, scrapers. Ive built it. I can build it for you.' },
]

export default function Studio() {
    return (
        <main className="page studio-page">

            {/* ── Hero ───────────────────────────────────────────────── */}
            <section className="studio-hero">
                <div className="container studio-hero-content">
                    <p className="studio-hero-eyebrow fade-up fade-up-2">Open to freelance</p>
                    <h1 className="studio-hero-title fade-up fade-up-3">
                        Solo dev.<br />
                        <span className="studio-hero-accent">Full stack. Ships.</span>
                    </h1>
                    <p className="studio-hero-sub fade-up fade-up-4">
                        I spent a decade as a professional chef before I started building apps. Turns out the obsession with getting every detail right doesn't stay in the kitchen.
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
                    <h2 className="studio-section-title">I do the whole thing.<br />Start to ship.</h2>
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
                            Mise en place isn't a cooking term. It's the only way to build anything worth using.
                        </blockquote>
                    </div>
                    <div className="story-body">
                        <p className="story-overline">The story</p>
                        <p className="story-text">I spent years as a professional chef before I wrote a line of code. The jump felt strange until I realised it wasn't... Both are about precision, pressure, and caring way too much about the details most people wouldn't notice.</p>
                        <p className="story-text">CalicoSquidCode is where I build things I actually want to exist. Right now that's Savor, a recipe app I started the day I couldnt bear to throw out my mums old recipe cards. Solo dev, nights and weekends, full-time cat supervisor. Based on a farm in Montenegro, which is as great as it sounds.</p>
                        <div className="story-stack">
                            <span className="stack-pill">React Native</span>
                            <span className="stack-pill">Expo</span>
                            <span className="stack-pill">Apollo</span>
                            <span className="stack-pill">GraphQL</span>
                            <span className="stack-pill">Node.js</span>
                            <span className="stack-pill">MongoDB</span>
                            <span className="stack-pill">Firebase</span>
                            <span className="stack-pill">Railway</span>
                            <span className="stack-pill">EAS</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── Work ───────────────────────────────────────────────── */}
            <section className="studio-work" id="work">
                <div className="container">
                    <p className="studio-overline">Featured work</p>
                    <h2 className="studio-section-title">Things I've built.</h2>
                    <div className="work-card">
                        <div className="work-card-left">
                            {/* Corrected: Using the inverted Savor wordmark */}
                            <img src="/images/Savor_white.png" alt="Savor" className="work-wordmark" />
                            <p className="work-tag">React Native · Android · 2026</p>
                            <p className="work-desc">A recipe app I built because every other one annoyed me. Paste a URL, scan a cookbook page, or type something out, Savor handles all of it. 12 fruit themes, a community feed that doesn't chase engagement, and a Pro tier that costs less than a coffee. Built alone, from scratch, while also trying to grow my own vegetables.</p>                            <div className="work-links">
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
                    <h2 className="cta-title">Got something to build?</h2>
                    <p className="cta-sub">I'm a solo dev who's done this end to end. If you've got an idea and need someone who'll actually care about it, get in touch.</p>
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