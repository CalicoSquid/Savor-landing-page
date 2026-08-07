import { useState } from 'react'
import '@fontsource/jetbrains-mono/400.css'
import '@fontsource/jetbrains-mono/600.css'
import '@fontsource/jetbrains-mono/700.css'
import './apocaleaf.css'

export default function Apocaleaf() {
  const [isAuthorised, setIsAuthorised] = useState(false)

  return (
    <main className={`apoc-page${isAuthorised ? ' apoc-page--authorised' : ''}`}>
      <div className="apoc-botanical-field" aria-hidden="true" />
      <img
        className="apoc-wildflowers"
        src="/apocaleaf/wildflowers.webp"
        srcSet="/apocaleaf/wildflowers-512.webp 512w, /apocaleaf/wildflowers.webp 960w"
        sizes="(max-width: 600px) 76vw, 58vw"
        alt=""
        aria-hidden="true"
        width="960"
        height="960"
        loading="eager"
        decoding="async"
      />
      <div className="apoc-noise" aria-hidden="true" />

      <section className="apoc-shell" aria-labelledby="apoc-title">
        <header className="apoc-file-header">
          <span>F.A.M.I.N.E.</span>
          <span>FIELD ARCHIVE // PRE-ISSUE</span>
          <span>STATUS: WITHHELD</span>
        </header>

        <div className="apoc-layout">
          <div className="apoc-copy">
            <p className="apoc-eyebrow">
              <span className="apoc-status-light" aria-hidden="true" />
              Android deployment pending
            </p>

            <h1 id="apoc-title">The field guide survived.</h1>

            <p className="apoc-lede">
              Following the Event, F.A.M.I.N.E. requires all Citizens to locate edible specimens,
              file verified reports, and maintain the archive. Compliance is rewarded.
            </p>

            <div className="apoc-brand-lockup" aria-label="Apocaleaf">
              <img
                src="/apocaleaf/standard-issue-mark.webp"
                alt=""
                aria-hidden="true"
                width="512"
                height="512"
                loading="eager"
                decoding="async"
              />
              <div>
                <p className="apoc-wordmark">APOCALEAF</p>
                <p className="apoc-brandline">Forage the ruins. File the report.</p>
              </div>
            </div>

            <aside className="apoc-safety" aria-label="Safety notice">
              <strong>Safety notice.</strong>
              <span> Wild plants can be poisonous. Never eat anything you cannot identify with certainty.</span>
            </aside>
          </div>

          <div className="apoc-dossier-wrap">
            <article className="apoc-dossier" aria-label="F.A.M.I.N.E. field directive">
              <div className="apoc-dossier-corner apoc-dossier-corner--top" aria-hidden="true" />
              <div className="apoc-dossier-corner apoc-dossier-corner--bottom" aria-hidden="true" />

              <div className="apoc-dossier-meta">
                <span>FORM AL-01</span>
                <span>ISSUE: PENDING</span>
              </div>

              <div className="apoc-seal-lockup" aria-hidden="true">
                <img
                  className="apoc-seal-ring"
                  src="/apocaleaf/famine-approval-ring.webp"
                  alt=""
                  width="512"
                  height="512"
                  loading="eager"
                  decoding="async"
                />
                <img
                  className="apoc-seal-mark"
                  src="/apocaleaf/standard-issue-mark.webp"
                  alt=""
                  width="512"
                  height="512"
                  loading="eager"
                  decoding="async"
                />
              </div>

              <p className="apoc-dossier-kicker">Citizen field directive</p>
              <h2>Archive access requires approval.</h2>

              <div className="apoc-directive-window" aria-live="polite">
                <div className="apoc-redactions" aria-hidden={isAuthorised}>
                  <span />
                  <span />
                  <span />
                  <span />
                </div>

                <ol className="apoc-directives" aria-hidden={!isAuthorised}>
                  <li><span>01</span>Locate edible specimens.</li>
                  <li><span>02</span>File verified field reports.</li>
                  <li><span>03</span>Rebuild the archive.</li>
                </ol>
              </div>

              <button
                type="button"
                className="apoc-authorise"
                aria-expanded={isAuthorised}
                onClick={() => setIsAuthorised(true)}
                disabled={isAuthorised}
              >
                <span className="apoc-button-seal" aria-hidden="true">F</span>
                <span>{isAuthorised ? 'File accepted' : 'Stamp to open file'}</span>
              </button>

              <div className="apoc-accepted-stamp" aria-hidden={!isAuthorised}>
                FILE ACCEPTED
              </div>

              <p className="apoc-dossier-note">
                {isAuthorised
                  ? 'Your cooperation has been noted.'
                  : 'Authorisation remains entirely routine.'}
              </p>
            </article>
          </div>
        </div>

        <footer className="apoc-file-footer">
          <span>FOOD ALLOCATION, MAPPING, AND INVENTORY NETWORK EXCHANGE</span>
          <span>COMING SOON</span>
        </footer>
      </section>
    </main>
  )
}
