// src/components/Nav.jsx
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'
import { isSavorVisit } from '../lib/potluckSavor'

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes'
const POTLUCK_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck&utm_source=potluck_web&utm_medium=header&utm_campaign=from_savor'

export default function Nav() {
  const { activeTheme } = useTheme()
  const location = useLocation()

  const isStudio  = location.pathname.startsWith('/studio')
  const isPotluck = location.pathname.startsWith('/potluck')
  const fromSavor = isPotluck && isSavorVisit(location.search)
  const isCaper   = location.pathname.startsWith('/caper') || location.pathname.startsWith('/forage')
  const isApocaleaf = location.pathname.startsWith('/apocaleaf')
  const isIronKitchen = location.pathname.startsWith('/iron-kitchen')
  const isRecipe  = location.pathname.startsWith('/r/')
  const isDemo    = location.pathname.startsWith('/demo')

  if (isRecipe || isDemo) return null

  const navTheme = isStudio ? 'studio' : isPotluck ? 'potluck' : isCaper ? 'forage' : isApocaleaf ? 'apocaleaf' : isIronKitchen ? 'iron-kitchen' : 'savor'
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

  // Potluck also introduces visitors to Savor, alongside its recipe discovery.
  const showCta = !isStudio && !isCaper && !isApocaleaf

  return (
    <nav className="nav" data-nav-theme={navTheme}>
      <div className="container">
        {isIronKitchen ? (
          <NavLink to="/" className="nav-collab-lockup" aria-label="Savor home">
            <img
              src="/images/Savor.webp"
              alt="Savor"
              className="nav-collab-savor"
              width="840"
              height="263"
              decoding="async"
            />
            <span className="nav-collab-times" aria-hidden="true">×</span>
            <img
              src="/images/iron-kitchen-logo.webp"
              alt="Iron Kitchen Inc."
              className="nav-collab-iki"
              width="512"
              height="512"
              decoding="async"
            />
          </NavLink>
        ) : (
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
        )}
        {showCta && (
          <a href={fromSavor ? POTLUCK_PLAY_URL : PLAY_URL} target="_blank" rel="noreferrer" className="nav-cta">
            {fromSavor ? 'Get Potluck' : isPotluck ? 'Get Savor' : 'Get the App'}
          </a>
        )}
      </div>
    </nav>
  )
}
