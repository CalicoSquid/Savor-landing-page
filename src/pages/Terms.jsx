import Footer from '../components/Footer'

export default function Terms() {
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
            Terms of Service
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
            These Terms of Service cover both <strong style={{ color: 'var(--text-primary)' }}>Savor</strong> and{' '}
            <strong style={{ color: 'var(--text-primary)' }}>Potluck by Savor</strong>, developed by CalicoSquid.
            By using either app you agree to these terms. Please read them — they're written plainly.
          </p>

          {section("Acceptance of terms", <>
            {p("By accessing or using Savor or Potluck by Savor you agree to be bound by these Terms. If you disagree with any part of them, you may not use the apps.")}
          </>)}

          {section("Use of the service", <>
            {p("You agree to use Savor and Potluck responsibly and in accordance with these Terms:")}
            {li([
              "You must be at least 13 years old to use Savor. Potluck has no age requirement as it collects no personal data.",
              "You agree not to use the service for any illegal or unauthorised purpose.",
              "You are responsible for maintaining the security of your account and password.",
              "You may not attempt to reverse-engineer, scrape, or otherwise interfere with the apps or our servers.",
            ])}
          </>)}

          {section("Third-party content and attribution", <>
            {p("Savor is a personal recipe organisation tool. When you import a recipe from a website, Savor extracts structured data (title, ingredients, method) for your private use.")}
            {li([
              "All imported recipes retain a link to the original source. We do not claim ownership of third-party content and we do not reproduce it for public distribution.",
              "By importing a recipe you confirm that your use is personal and non-commercial, and that you will respect the original creator's copyright.",
              "Savor drives traffic back to original creators and publishers. We are not a content aggregator or piracy tool.",
            ])}
          </>)}

          {section("User-generated content", <>
            {p("Savor includes a community feed where users can share recipes.")}
            {li([
              "Content you write yourself — your own recipes, notes, and adaptations — remains yours. You grant us a licence to display it within the service.",
              "When you share a recipe to the Community Feed you are sharing your own saved copy. Shared recipes include a link to the original source where one exists.",
              "Shared recipes persist in the Community Feed even if you later delete your account. This is intentional — the community feed is designed to be a permanent, shared resource — and you accept this when you choose to share.",
              "We reserve the right to remove any content that violates these Terms or applicable law.",
            ])}
          </>)}

          {section("Subscriptions and billing", <>
            {p("Certain features of Savor require a paid subscription (Savor Pro).")}
            {li([
              "Subscriptions are billed through Google Play in accordance with their billing policies.",
              "Subscription management, cancellation, and refunds are handled by Google Play.",
              "We reserve the right to change subscription pricing with reasonable notice.",
              "Free tier features remain available without a subscription.",
            ])}
          </>)}

          {section("DMCA and copyright", <>
            {p("We respect intellectual property rights. If you believe content in Savor infringes your copyright, please contact us at support@getsavor.recipes with:")}
            {li([
              "A description of the copyrighted work you believe has been infringed.",
              "The location of the infringing content within the app.",
              "Your contact details and a statement that you have a good faith belief the use is not authorised.",
            ])}
            {p("We will investigate and act promptly on valid takedown requests.")}
          </>)}

          {section("Account termination", <>
            {p("You may delete your Savor account at any time from within the app. We may suspend or terminate your account if you breach these Terms or use the service in a way that could expose us or others to legal liability.")}
          </>)}

          {section("Disclaimer of warranties", <>
            {p("Savor and Potluck by Savor are provided on an 'as is' basis without warranties of any kind, express or implied. We do not warrant that imported recipe data will be accurate, complete, or error-free. We do not guarantee uninterrupted access to the service.")}
          </>)}

          {section("Limitation of liability", <>
            {p("CalicoSquid, its developers, and partners shall not be liable for any indirect, incidental, or consequential damages arising from your use of the service, including any reliance on third-party content imported via the apps.")}
          </>)}

          {section("Changes to these terms", <>
            {p("We reserve the right to update these Terms at any time. We will update the date at the top of this page when we do. Continued use of the service after changes take effect constitutes your acceptance of the updated Terms.")}
          </>)}

          {section("Governing law", <>
            {p("These Terms are governed by applicable law. Any disputes will be resolved in the jurisdiction in which CalicoSquid operates.")}
          </>)}

          <div style={{
            borderTop: '1px solid rgba(0,0,0,0.07)',
            paddingTop: 32,
            marginTop: 16,
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>
              Questions about these terms?{' '}
              <a
                href="mailto:support@getsavor.recipes?subject=Terms%20of%20Service"
                style={{ color: 'var(--accent)', fontWeight: 700, textDecoration: 'none' }}
              >
                support@getsavor.recipes
              </a>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginTop: 8 }}>
              You can also read our{' '}
              <a href="/privacy" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                Privacy Policy
              </a>.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  );
}