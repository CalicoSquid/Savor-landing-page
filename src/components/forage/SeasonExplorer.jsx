// src/components/forage/SeasonExplorer.jsx
// The page's interactive centrepiece. Tap a season and the wild edibles
// change — the app's core "what's out there right now" loop, made touchable.
// Uses real species data from forageShowcase.js. Warm, gently alive: cards
// stagger in on switch, the seasonal backdrop cross-fades.
import { useState } from 'react'
import { SEASONS, KIND_COLOR } from '../../data/forageShowcase'

// Which season is "now" — pick the real current one so the page opens on it.
function currentSeasonKey() {
  const m = new Date().getMonth() + 1
  if (m >= 3 && m <= 5) return 'spring'
  if (m >= 6 && m <= 8) return 'summer'
  if (m >= 9 && m <= 11) return 'autumn'
  return 'winter'
}

export default function SeasonExplorer() {
  const [activeKey, setActiveKey] = useState(currentSeasonKey())
  const active = SEASONS.find((s) => s.key === activeKey) || SEASONS[0]

  return (
    <div className="fg-explorer">
      <div className="fg-explorer-head">
        <p className="fg-eyebrow">Forage Near Me</p>
        <h2 className="fg-explorer-title">What&rsquo;s out there right now</h2>
        <p className="fg-explorer-sub">
          Wild food follows the seasons. Tap through the year and see a taste
          of what&rsquo;s ready to find.
        </p>
      </div>

      {/* Season selector */}
      <div className="fg-season-tabs" role="tablist" aria-label="Season">
        {SEASONS.map((s) => (
          <button
            key={s.key}
            role="tab"
            aria-selected={s.key === activeKey}
            className={`fg-season-tab ${s.key === activeKey ? 'is-active' : ''}`}
            style={s.key === activeKey ? { '--tab-accent': s.accent } : undefined}
            onClick={() => setActiveKey(s.key)}
          >
            <span className="fg-season-tab-label">{s.label}</span>
            <span className="fg-season-tab-months">{s.months}</span>
          </button>
        ))}
      </div>

      {/* Stage: backdrop + chip + species */}
      <div className="fg-explorer-stage">
        {SEASONS.map((s) => (
          <div
            key={s.key}
            className={`fg-explorer-bg ${s.key === activeKey ? 'is-active' : ''}`}
            style={{ backgroundImage: `url(${s.bg})` }}
            aria-hidden="true"
          />
        ))}
        <div className="fg-explorer-scrim" aria-hidden="true" />

        <div className="fg-explorer-content" key={activeKey}>
          <span className="fg-season-chip" style={{ borderColor: active.accent }}>
            <span className="fg-season-chip-dot" style={{ background: active.accent }} />
            {active.chip}
          </span>

          <ul className="fg-finds">
            {active.species.map((sp, i) => (
              <li
                className="fg-find"
                key={sp.sci}
                style={{ animationDelay: `${i * 70}ms` }}
              >
                <span
                  className="fg-find-kind"
                  style={{ background: KIND_COLOR[sp.kind] || '#3D6B4F' }}
                  title={sp.kind}
                />
                <span className="fg-find-body">
                  <span className="fg-find-top">
                    <span className="fg-find-name">{sp.name}</span>
                    {sp.note && (
                      <span className="fg-find-flag" title="Has a safety note — check before picking">
                        ⚠ ID care
                      </span>
                    )}
                  </span>
                  <span className="fg-find-sci">{sp.sci}</span>
                  <span className="fg-find-meta">
                    {sp.parts.join(' · ')} &nbsp;—&nbsp; {sp.flavour}
                  </span>
                </span>
                <span className="fg-find-rating" title={`Edibility ${sp.rating} of 5`}>
                  {'★'.repeat(sp.rating)}<span className="fg-find-rating-dim">{'★'.repeat(5 - sp.rating)}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="fg-explorer-foot">
            A handful of {active.species.length}. In the app, Forage shows what&rsquo;s
            genuinely in season near <em>your</em> location.
          </p>
        </div>
      </div>
    </div>
  )
}