// src/components/Nav.jsx
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes'

export default function Nav() {
  const { activeTheme } = useTheme()
  const location = useLocation()

  const isStudio  = location.pathname.startsWith('/studio')
  const isPotluck = location.pathname.startsWith('/potluck')
  const isCaper   = location.pathname.startsWith('/caper') || location.pathname.startsWith('/forage')
  const isApocaleaf = location.pathname.startsWith('/apocaleaf')
  const isRecipe  = location.pathname.startsWith('/r/')
  const isDemo    = location.pathname.startsWith('/demo')

  if (isRecipe || isDemo) return null

  const navTheme = isStudio ? 'studio' : isPotluck ? 'potluck' : isCaper ? 'forage' : isApocaleaf ? 'apocaleaf' : 'savor'
  const iconSrc  = isStudio  ? '/images/logo_W.webp'
                 : isPotluck ? '/potluck/potluck-icon.webp'
                 : isCaper   ? '/caper/caper-icon.webp'
                 : isApocaleaf ? '/apocaleaf/standard-issue-mark.webp'
                 : getIcon(activeTheme.name)
  const iconAlt  = isStudio  ? 'CalicoSquid Code'
                 : isPotluck ? 'Potluck by Savor'
                 : isCaper   ? 'Caper'
                 : isApocaleaf ? 'Apocaleaf'
                 : 'Savor'

  // Persistent install CTA only belongs on Savor's own pages (home, about,
  // faq, etc). Potluck/Studio/Caper have their own pages and their own
  // conversion paths — a "Get Savor" button there sends mixed signals.
  const showCta = !isStudio && !isPotluck && !isCaper && !isApocaleaf

  return (
    <nav className="nav" data-nav-theme={navTheme}>
      <div className="container">
        <NavLink to="/">
          <img
            src={iconSrc}
            alt={iconAlt}
            className={`nav-icon${isPotluck ? ' nav-icon--potluck' : isCaper ? ' nav-icon--forage' : isApocaleaf ? ' nav-icon--apocaleaf' : ''}`}
            width="44"
            height="44"
            decoding="async"
          />
        </NavLink>
        {showCta && (
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="nav-cta">
            Get the App
          </a>
        )}
      </div>
    </nav>
  )
}