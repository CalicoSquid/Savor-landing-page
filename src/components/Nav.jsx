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
  const isForage  = location.pathname.startsWith('/forage')
  const isRecipe  = location.pathname.startsWith('/r/')
  const isDemo    = location.pathname.startsWith('/demo')

  if (isRecipe || isDemo) return null

  const navTheme = isStudio ? 'studio' : isPotluck ? 'potluck' : isForage ? 'forage' : 'savor'
  const iconSrc  = isStudio  ? '/images/logo_W.webp'
                 : isPotluck ? '/potluck/potluck-icon.webp'
                 : isForage  ? '/forage/forage-icon-bg.webp'
                 : getIcon(activeTheme.name)
  const iconAlt  = isStudio  ? 'CalicoSquid Code'
                 : isPotluck ? 'Potluck by Savor'
                 : isForage  ? 'Forage'
                 : activeTheme.name

  // Persistent install CTA only belongs on Savor's own pages (home, about,
  // faq, etc). Potluck/Studio/Forage have their own pages and their own
  // conversion paths — a "Get Savor" button there sends mixed signals.
  const showCta = !isStudio && !isPotluck && !isForage

  return (
    <nav className="nav" data-nav-theme={navTheme}>
      <div className="container">
        <NavLink to="/">
          <img
            src={iconSrc}
            alt={iconAlt}
            className={`nav-icon${isPotluck ? ' nav-icon--potluck' : isForage ? ' nav-icon--forage' : ''}`}
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