import Footer from '../components/Footer'

export default function Privacy() {
  const LAST_UPDATED = "August 15, 2026";

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
              Potluck by Savor — no account, minimal anonymous usage data
            </p>
            <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
              Potluck requires no account and does not collect your name, email address, or profile information.
              The web version creates a random identifier in your browser so we can count spins and understand a few basic
              Potluck actions. It is not linked to a Savor account or to a personal profile.
            </p>
          </div>

          {section("What we collect — Savor", <>
            {p("Savor requires an account to save and manage your recipes. When you use Savor we collect:")}
            {li([
              "Google profile — when you sign in with Google we receive your display name, email address, and profile picture from Google.",
              "Email address — if you register with email and password, we store your email for authentication only.",
              "Your username — displayed alongside recipes you share to the community feed.",
              "Recipes you save — stored in your personal recipe box on our servers.",
              "Recipes you choose to share — visible to other Savor users in the community feed.",
              "Subscription status — if you subscribe to Savor Pro, we receive your subscription status from RevenueCat and Google Play. We never see your payment details.",
            ])}
            {p("We do not collect your real name (beyond what Google provides), phone number, location, contacts, or any other personal information.")}
          </>)}

          {section("What we collect — Potluck by Savor", <>
            {p("Potluck has no accounts and no sign-in. We do not collect your name, email address, phone number, or a Savor profile.")}
            {p("On the Potluck website, your browser creates a random local identifier. We send that identifier with random-recipe requests and a small set of product events such as visits, spin milestones, recipe opens, and Potluck/Savor link clicks. This lets us count spins and understand whether the product is being used. The identifier is not linked to a Savor account or to information that directly identifies you.")}
            {p("The web page also sends recently seen recipe IDs with a spin request so the server can avoid immediate repeats. Those IDs describe recipes, not you. Clearing this site's browser storage resets the local Potluck identifier.")}
            {p("The Android app keeps its Potluck history and weekly choices locally on your device. Normal network requests still reach our server to fetch recipe data and may include standard technical request information such as IP address and user agent in infrastructure logs.")}
          </>)}

          {section("Camera and scan", <>
            {p("Savor's scan feature lets you photograph physical recipe cards and cookbooks to import them into your recipe box. When you use this feature:")}
            {li([
              "Your camera is accessed only when you actively initiate a scan.",
              "Images are processed on-device using ML Kit OCR to extract text.",
              "Where needed, extracted text is sent to our server for recipe parsing. The image itself is never sent to or stored on our servers.",
              "Processed text is not retained after your recipe has been imported.",
            ])}
          </>)}

          {section("Push notifications", <>
            {p("With your permission, Savor may send you push notifications about your recipe activity and community updates. Notifications are optional — you can enable or disable them at any time in your device settings. We do not use notifications for advertising.")}
          </>)}

          {section("How we use your data", <>
            {p("Savor uses your data solely to provide the service:")}
            {li([
              "Your email and Google profile authenticate you and keep your recipe box synced across devices.",
              "Your username is displayed alongside recipes you share to the community feed.",
              "Shared recipes are displayed in the community feed as you intended.",
              "Subscription status unlocks Pro features in the app.",
            ])}
            {p("Potluck's anonymous web identifier and basic event data are used only to operate the random-recipe service, count spins, diagnose problems, and understand basic feature use. They are not used to build an advertising profile.")}
            {p("We do not sell your data. We do not use your data for advertising. We do not share your data with third parties except the infrastructure providers listed below.")}
          </>)}

          {section("Third-party services", <>
            {p("We use a small number of trusted services to run the apps:")}
            {li([
              "Firebase Authentication (Google) — handles sign-in for Savor. Your email and Google profile are stored with Firebase.",
              "MongoDB Atlas — stores your recipes and account data on our behalf.",
              "Railway — hosts our server that both apps communicate with.",
              "RevenueCat — manages subscription billing for Savor Pro. RevenueCat receives your subscription status and purchase history via Google Play. We never receive your payment card details.",
              "Expo / EAS — used to deliver over-the-air app updates. No personal data is transmitted.",
            ])}
            {p("Each of these services has their own privacy policy. We have chosen providers who take data seriously and do not use your data for their own advertising or profiling.")}
          </>)}

          {section("Data retention and deletion", <>
            {p("You can delete your Savor account at any time from within the app (Settings → Privacy & Data → Delete Account). This permanently deletes your account, email address, and all saved recipes immediately.")}
            {p("Recipes you have shared to the community feed remain as anonymous contributions after account deletion — your username is removed but the recipe stays. This is intentional so the community isn't disrupted when someone leaves. If you want a specific shared recipe removed, contact us.")}
            {p("Potluck does not maintain a user account or personal profile to delete. Anonymous operational and product-event records are not linked to a known person or Savor account.")}
          </>)}

          {section("Children's privacy", <>
            {p("Our apps are not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us and we will delete it.")}
          </>)}

          {section("Your rights", <>
            {p("Depending on where you live, you may have rights regarding your personal data — including the right to access, correct, or delete it. To exercise any of these rights, contact us at the address below. We will respond within a reasonable timeframe.")}
          </>)}

          {section("Changes to this policy", <>
            {p("If we make material changes to this policy we will update the date at the top of this page. Continued use of the apps after changes constitutes acceptance of the updated policy.")}
          </>)}

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

      <Footer />
    </main>
  );
}