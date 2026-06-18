import Footer from '../components/Footer'

export default function ForagePrivacy() {
  const EFFECTIVE = 'May 2025'

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
  )

  const p = (text) => (
    <p style={{
      fontSize: '0.97rem',
      color: 'var(--text-secondary)',
      lineHeight: 1.75,
      marginBottom: 12,
    }}>
      {text}
    </p>
  )

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
  )

  const table = (rows) => (
    <div style={{ overflowX: 'auto', marginBottom: 16 }}>
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        fontSize: '0.9rem',
        color: 'var(--text-secondary)',
      }}>
        <thead>
          <tr>
            <th style={thStyle}>Purpose</th>
            <th style={thStyle}>Data used</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([purpose, data], i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
              <td style={tdStyle}>{purpose}</td>
              <td style={tdStyle}>{data}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )

  const thStyle = {
    textAlign: 'left',
    padding: '10px 14px',
    background: 'var(--surface-2)',
    fontWeight: 700,
    fontSize: '0.82rem',
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    color: 'var(--text-muted)',
  }

  const tdStyle = {
    padding: '10px 14px',
    verticalAlign: 'top',
    lineHeight: 1.65,
  }

  return (
    <main className="page" style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <section style={{ padding: '70px 0 140px' }}>
        <div className="container" style={{ maxWidth: 680, margin: '0 auto' }}>

          {/* Eyebrow */}
          <p style={{
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: '#3d7a4f',
            marginBottom: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
          }}>
            <span style={{ display: 'block', width: 24, height: 2, background: '#3d7a4f', borderRadius: 99 }} />
            Legal · Forage
          </p>

          {/* App identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <img
              src="/forage/forage-icon.webp"
              alt="Forage"
              style={{ width: 56, height: 56, borderRadius: 14, boxShadow: '0 4px 16px rgba(0,0,0,0.12)' }}
            />
            <div>
              <h1 style={{
                fontSize: 'clamp(1.8rem, 4vw, 2.6rem)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                color: 'var(--text-primary)',
                marginBottom: 4,
              }}>
                Privacy Policy
              </h1>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', opacity: 0.7, margin: 0 }}>
                Forage by CalicoSquid · Effective {EFFECTIVE}
              </p>
            </div>
          </div>

          {/* Intro */}
          <p style={{
            fontSize: '1.05rem',
            color: 'var(--text-secondary)',
            lineHeight: 1.75,
            marginBottom: 48,
          }}>
            This Privacy Policy explains how <strong style={{ color: 'var(--text-primary)' }}>CalicoSquid</strong> collects,
            uses, and protects your information when you use the <strong style={{ color: 'var(--text-primary)' }}>Forage</strong> mobile
            app on Android and iOS. We built Forage to get people outside — not to harvest data.
          </p>

          {/* 1 */}
          {section('1. Who we are', <>
            {p('Forage is developed and operated by CalicoSquid, an independent developer. Questions about this policy: hello@getsavor.recipes with "Forage Privacy" in the subject line.')}
          </>)}

          {/* 2 */}
          {section('2. Information we collect', <>
            <h3 style={h3}>2.1 Account information (optional — sign-in only)</h3>
            {p('Signing in is not required to use the Field Guide. If you choose to sign in with Google, we receive and store:')}
            {li([
              'Your Google display name',
              'Your email address',
              'Your Google profile photo URL',
              'A Firebase Authentication UID — a unique identifier that links your Google account to your Forage account',
            ])}
            {p('We do not receive or store your Google password.')}

            <h3 style={h3}>2.2 Foraging logbook</h3>
            {p('When you log a find, we store on your device and (if signed in) on our servers:')}
            {li([
              'Scientific and common name of the species',
              'A human-readable place name (e.g. "Podgorica, Montenegro") reverse-geocoded from your GPS position at the moment of logging — we do not store your raw GPS coordinates',
              'Date the find was logged',
              'An iNaturalist photo URL for the species, if one was fetched',
            ])}

            <h3 style={h3}>2.3 Campfire Kitchen (Forage Wild subscribers)</h3>
            {li([
              'Which species you have cooked (scientific name, common name, recipe name)',
              'The date each recipe was marked as cooked',
              'The recipe content at the time of cooking',
            ])}

            <h3 style={h3}>2.4 Discovered species</h3>
            {p('When you run a Forage Near Me search, we store a list of scientific names of species found near you. This powers your Campfire Kitchen cookbook and badge system. Stored on your device and (if signed in) on our servers.')}

            <h3 style={h3}>2.5 Location data</h3>
            {p('Forage requests foreground location access ("precise location, while using the app") for two purposes only:')}
            {li([
              'To query the iNaturalist API for wild edible species near your position',
              'To reverse-geocode a human-readable place name for your logbook entries',
            ])}
            {p('We do not track your location in the background. Your coordinates are rounded to a ~1.1 km grid before being sent to our server and are not retained after your search completes. Raw GPS coordinates are never stored on our servers.')}

            <h3 style={h3}>2.6 What we do NOT collect</h3>
            {li([
              'Advertising identifiers (GAID / IDFA)',
              'Precise or persistent GPS coordinates',
              'Browsing history or activity outside Forage',
              'Contacts, microphone, camera, or any permissions beyond location',
              'Crash analytics or usage telemetry',
              'Payment card details (handled by Google Play Billing)',
            ])}
          </>)}

          {/* 3 */}
          {section('3. How we use your information', <>
            {p('We use your information only to operate Forage:')}
            {table([
              ['Creating and identifying your account', 'Google UID, email, display name'],
              ['Syncing your logbook across devices (Wild)', 'Logbook entries'],
              ['Powering your Campfire Kitchen cookbook', 'Discovered species list, cooked recipes'],
              ['Awarding foraging badges', 'Logbook entries, cooked recipes, habitat data'],
              ['Finding wild edibles near you', 'Rounded GPS coordinates (search only, not stored)'],
              ['Showing a location name in your logbook', 'Reverse-geocoded place name'],
              ['Offline access', 'Local device cache (AsyncStorage)'],
            ])}
            {p('We do not use your data for advertising, profiling, or any purpose not listed above.')}
          </>)}

          {/* 4 */}
          {section('4. How we share your information', <>
            {p('We do not sell your personal data. We share data only with the following service providers, strictly as needed to run the app:')}

            {[
              {
                name: 'Google Firebase',
                desc: 'Manages authentication. Your Google UID, email, display name, and photo URL are processed by Firebase.',
                url: 'https://firebase.google.com/support/privacy',
              },
              {
                name: 'iNaturalist',
                desc: 'Receives your rounded GPS coordinates at search time to return local species observations. Operated by the California Academy of Sciences.',
                url: 'https://www.inaturalist.org/pages/privacy',
              },
              {
                name: 'Railway',
                desc: 'Hosts our GraphQL backend. Your account data, logbook, and cookbook data are stored in secure MongoDB databases on Railway infrastructure.',
                url: 'https://railway.app/legal/privacy',
              },
              {
                name: 'Expo',
                desc: 'Delivers over-the-air JavaScript updates. Expo may process your app version to deliver updates. No personal account data is shared with Expo.',
                url: 'https://expo.dev/privacy',
              },
              {
                name: 'Google Play Billing',
                desc: 'Processes Forage Wild purchases entirely within Google Play. We never receive or store payment card details.',
                url: 'https://payments.google.com/payments/apis-secure/get_legal_document?ldo=0&ldt=privacynotice',
              },
            ].map(({ name, desc, url }) => (
              <div key={name} style={{
                background: 'var(--surface-2)',
                borderRadius: 'var(--radius-sm)',
                padding: '14px 18px',
                marginBottom: 10,
              }}>
                <p style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontSize: '0.95rem' }}>{name}</p>
                <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: 1.65, margin: 0 }}>{desc}{' '}
                  <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: '#3d7a4f', fontWeight: 600, textDecoration: 'none' }}>
                    Privacy policy ↗
                  </a>
                </p>
              </div>
            ))}
          </>)}

          {/* 5 */}
          {section('5. Data storage and security', <>
            {p('Your data is stored in two places:')}
            {li([
              'On your device — logbook entries, discovered species, cached species data, and cached search results are stored locally using AsyncStorage. This persists until you uninstall the app or delete your account.',
              'On our servers — if you are signed in, your account record, logbook, discovered species list, and Campfire Kitchen history are stored in a MongoDB database hosted on Railway. All data is transmitted over HTTPS.',
            ])}
            {p('We take reasonable technical measures to protect your data including encrypted transport (TLS), server-side authentication guards, and access controls.')}
          </>)}

          {/* 6 */}
          {section('6. Data retention', <>
            {table([
              ['Account information', 'Until you delete your account'],
              ['Logbook entries', 'Until you delete your account or remove the entry'],
              ['Campfire Kitchen history', 'Until you delete your account or unmark the recipe'],
              ['Discovered species list', 'Until you delete your account'],
              ['Local device cache', 'Until you uninstall the app'],
              ['iNaturalist search coordinates', 'Not retained — discarded after search completes'],
            ])}
            {p('When you delete your account via Settings → Delete account, your account record, logbook, discovered species list, and Campfire history are permanently deleted from our servers immediately. Database backups rotate within 7 days.')}
          </>)}

          {/* 7 */}
          {section('7. Your rights', <>
            {p('Regardless of where you live, we honour the following:')}
            {li([
              'Access — view your logbook and Campfire history directly in the app at any time.',
              'Deletion — delete your account at any time via Settings → Delete account. This permanently removes all your data from our servers.',
              'Correction — signing out and back in refreshes your profile from Google. Contact us for further corrections.',
              'Portability — email hello@getsavor.recipes to request an export of your logbook or recipe history.',
              'Withdrawal of consent — revoke location permission in device settings at any time. Forage Near Me will stop working; all other features remain available.',
            ])}
            {p('If you are in the EEA or United Kingdom, you may have additional rights under GDPR or UK GDPR, including the right to lodge a complaint with your local data protection authority.')}
          </>)}

          {/* 8 */}
          {section('8. Location permission', <>
            {p('Forage requests foreground location (ACCESS_FINE_LOCATION on Android, "Precise Location" on iOS). This permission is used exclusively when you tap "Forage Near Me" and to name your logbook entries. We never request background location. You can revoke this permission at any time in your device settings without affecting any other feature.')}
          </>)}

          {/* 9 */}
          {section("9. Children's privacy", <>
            {p("Forage is not directed at children under 13 (or 16 in the EEA). We do not knowingly collect personal information from children. Contact hello@getsavor.recipes if you believe a child has created an account and we will delete it promptly.")}
          </>)}

          {/* 10 */}
          {section('10. Third-party content', <>
            {p('Species data in the Field Guide is sourced from the Plants For A Future (PFAF) database — publicly available reference data. No personal data is transmitted to PFAF.')}
            {p('Species photos are sourced from the iNaturalist API under Creative Commons licences. Tapping "Learn more on Wikipedia" opens an external browser — Wikipedia\'s own privacy policy applies from that point.')}
          </>)}

          {/* 11 */}
          {section('11. Changes to this policy', <>
            {p('We may update this policy from time to time. When we do, we will update the effective date and, for material changes, notify you within the app. Continued use of Forage after changes take effect constitutes acceptance.')}
          </>)}

          {/* Contact */}
          <div style={{
            borderTop: '1px solid rgba(0,0,0,0.07)',
            paddingTop: 32,
            marginTop: 16,
          }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 10 }}>
              Questions about this policy?{' '}
              <a
                href="mailto:hello@getsavor.recipes?subject=Forage%20Privacy"
                style={{ color: '#3d7a4f', fontWeight: 700, textDecoration: 'none' }}
              >
                hello@getsavor.recipes
              </a>
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.65, margin: 0 }}>
              This policy covers Forage only. For Savor Recipes and Potluck, see the{' '}
              <a href="/privacy" style={{ color: '#3d7a4f', textDecoration: 'none', fontWeight: 600 }}>
                Savor Privacy Policy
              </a>.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </main>
  )
}

const h3 = {
  fontSize: '1rem',
  fontWeight: 700,
  color: 'var(--text-primary)',
  marginBottom: 8,
  marginTop: 20,
}