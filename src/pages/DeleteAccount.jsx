export default function DeleteAccount() {
  return (
    <main className="page" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <section style={{ padding: '70px 0 140px' }}>
        <div className="container" style={{ maxWidth: 640, margin: '0 auto' }}>

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
            Account Management
          </p>

          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            lineHeight: 1.1,
            color: 'var(--text-primary)',
            marginBottom: 20,
          }}>
            Delete Your Savor Account
          </h1>

          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            marginBottom: 48,
          }}>
            You can delete your account and all associated personal data directly inside the Savor app. No emails, no forms — it's right there in Settings.
          </p>

          {/* Steps */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 48 }}>
            {[
              { n: '1', title: 'Open Savor', body: 'Launch the app on your Android device.' },
              { n: '2', title: 'Go to Settings', body: 'Tap your profile icon, then navigate to Settings.' },
              { n: '3', title: 'Tap Delete Account', body: 'Scroll to the bottom and tap the red Delete Account button.' },
              { n: '4', title: 'Confirm', body: 'Follow the on-screen confirmation. Your account and all personal data will be permanently deleted immediately.' },
            ].map(({ n, title, body }) => (
              <div key={n} style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'var(--grad-fruit)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 800,
                  fontSize: '1rem',
                  flexShrink: 0,
                }}>
                  {n}
                </div>
                <div>
                  <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>{title}</p>
                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{body}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Data note */}
          <div style={{
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius)',
            padding: '24px 28px',
            marginBottom: 48,
          }}>
            <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>What gets deleted</p>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              Your account, email address, saved recipes, and all personal data are permanently deleted immediately.
              Recipes you've shared to the community feed remain as anonymous contributions — this is by design,
              so the community isn't affected when someone leaves.
            </p>
          </div>

          {/* Contact */}
          <div style={{
            borderTop: '1px solid rgba(0,0,0,0.07)',
            paddingTop: 32,
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Need help or can't access the app?{' '}
              <a
                href="mailto:support@getsavor.recipes?subject=Delete%20My%20Account"
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
  )
}