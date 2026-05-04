export default function Privacy() {
  const LAST_UPDATED = "May 2026";

  const section = (title, children) => (
    <div style={{ marginBottom: 48 }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        color: 'var(--text-primary)',
        marginBottom: 12,
      }}>
        {title}
      </h2>
      {children}
    </div>
  );

  const p = (text) => (
    <p style={{
      fontSize: '0.97rem',
      color: 'var(--text-secondary)',
      lineHeight: 1.75,
      marginBottom: 12,
    }}>
      {text}
    </p>
  );

  const li = (items) => (
    <ul style={{ paddingLeft: 20, margin: '8px 0 12px' }}>
      {items.map((item, i) => (
        <li key={i} style={{
          fontSize: '0.97rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.75,
          marginBottom: 6,
        }}>
          {item}
        </li>
      ))}
    </ul>
  );

  return (
    <main className="page" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <section style={{ padding: '70px 0 140px' }}>
        <div className="container" style={{ maxWidth: 680, margin: '0 auto' }}>

          {/* Overline */}
          <p style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ display: 'block', width: 24, height: 2, background: 'var(--accent)', borderRadius: 99 }} />
            Legal
          </p>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: 12,
          }}>
            Privacy Policy
          </h1>

          <p style={{
            fontSize: '0.85rem',
            color: 'var(--text-secondary)',
            marginBottom: 48,
            opacity: 0.7,
          }}>
            Last updated: {LAST_UPDATED}
          </p>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            marginBottom: 48,
          }}>
            This policy covers both <strong style={{ color: 'var(--text-primary)' }}>Savor</strong> and{' '}
            <strong style={{ color: 'var(--text-primary)' }}>Potluck by Savor</strong>, developed by
            CalicoSquid. We built these apps to be useful, not to harvest your data.
            This policy explains plainly what we collect, why, and what we don't do.
          </p>

          {/* Potluck callout */}
          <div style={{
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius)',
            padding: '20px 24px',
            marginBottom: 48,
            borderLeft: '3px solid var(--accent)',
          }}>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6, fontSize: '0.95rem' }}>
              Potluck by Savor — no account, no data
            </p>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Potluck requires no account and collects no personal information whatsoever.
              It fetches random recipes from our server and stores your session locally
              on your device only. Nothing is sent to us about you or your usage.
            </p>
          </div>

          {section("What we collect — Savor", <>
            {p("Savor requires an account to save and manage your recipes. When you use Savor we collect:")}
            {li([
              "Email address — used for account creation and authentication only.",
              "Recipes you save — stored in your personal recipe box on our servers.",
              "Recipes you choose to share — visible to other Savor users in the community feed.",
              "Your username — displayed alongside recipes you share.",
            ])}
            {p("We do not collect your real name, phone number, location, contacts, or any other personal information.")}
          </>)}

          {section("What we collect — Potluck by Savor", <>
            {p("Potluck has no accounts and no sign-in. We collect nothing about you personally.")}
            {p("When you spin, your device makes a network request to our server to fetch a random recipe. This request contains no identifying information — it is indistinguishable from any anonymous web request.")}
            {p("Your spin session (which recipes you've seen) is stored locally on your device using AsyncStorage and is never sent to us.")}
          </>)}

          {section("How we use your data", <>
            {p("Savor uses your data solely to provide the service:")}
            {li([
              "Your email authenticates you via Firebase Authentication.",
              "Your recipes are stored so you can access them across devices.",
              "Shared recipes are displayed in the community feed as you intended.",
            ])}
            {p("We do not sell your data. We do not use your data for advertising. We do not share your data with third parties except the infrastructure providers listed below.")}
          </>)}

          {section("Third-party services", <>
            {p("We use a small number of trusted services to run the apps:")}
            {li([
              "Firebase Authentication (Google) — handles sign-in for Savor. Your email is stored with Firebase.",
              "MongoDB Atlas — stores your recipes and account data on our behalf.",
              "Railway — hosts our server that both apps communicate with.",
            ])}
            {p("Each of these services has their own privacy policy. We have chosen providers who take data seriously and do not use your data for their own advertising or profiling.")}
          </>)}

          {section("Data retention and deletion", <>
            {p("You can delete your Savor account at any time from within the app (Settings → Delete Account). This permanently deletes your account, email address, and all saved recipes immediately.")}
            {p("Recipes you have shared to the community feed remain as anonymous contributions after account deletion — your username is removed but the recipe stays. This is intentional so the community isn't disrupted when someone leaves. If you want a specific shared recipe removed, contact us.")}
            {p("Potluck stores nothing on our servers tied to you, so there is nothing to delete.")}
          </>)}

          {section("Children's privacy", <>
            {p("Our apps are not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.")}
          </>)}

          {section("Changes to this policy", <>
            {p("If we make material changes to this policy we will update the date at the top of this page. Continued use of the apps after changes constitutes acceptance of the updated policy.")}
          </>)}

          {/* Contact */}
          <div style={{
            borderTop: '1px solid rgba(0,0,0,0.07)',
            paddingTop: 32,
            marginTop: 16,
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Questions about this policy?{' '}
              <a
                href="mailto:support@getsavor.recipes?subject=Privacy%20Policy"
                style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}
              >
                support@getsavor.recipes
              </a>
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container footer-inner">
          <span className="footer-copy">
            <a href="/studio" className="footer-csc-link">
              calicoSquid<span className="footer-csc-code">Code</span>
            </a>
          </span>
        </div>
      </footer>
    </main>
  );
}