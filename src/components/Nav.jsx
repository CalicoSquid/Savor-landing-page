// src/components/Nav.jsx
import { useSyncExternalStore } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'
import { isSavorVisit } from '../lib/potluckSavor'

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes'
const POTLUCK_PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorpotluck&utm_source=potluck_web&utm_medium=header&utm_campaign=from_savor'
const subscribeToHydration = () => () => {}
const clientHydrated = () => true
const serverHydrated = () => false

export default function Nav() {
  const { activeTheme } = useTheme()
  const location = useLocation()
  // Static HTML has no visitor query; keep the hydration render identical.
  const hydrated = useSyncExternalStore(subscribeToHydration, clientHydrated, serverHydrated)

  const isStudio  = location.pathname.startsWith('/studio')
  const isPotluck = location.pathname.startsWith('/potluck')
  const fromSavor = hydrated && isPotluck && isSavorVisit(location.search)
  const isIronKitchen = location.pathname.startsWith('/iron-kitchen')
  const isRecipe  = location.pathname.startsWith('/r/')
  const isDemo    = location.pathname.startsWith('/demo')

  if (isRecipe || isDemo) return null

  const navTheme = isStudio ? 'studio' : isPotluck ? 'potluck' : isIronKitchen ? 'iron-kitchen' : 'savor'
  const iconSrc  = isStudio  ? '/images/logo_W.webp'
                 : isPotluck ? '/potluck/potluck-icon.webp'
                 : getIcon(activeTheme.name)
  const iconAlt  = isStudio  ? 'CalicoSquid Code'
                 : isPotluck ? 'Potluck by Savor'
                 : 'Savor'

  // Potluck also introduces visitors to Savor, alongside its recipe discovery.
  const showCta = !isStudio

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
              className={`nav-icon${isPotluck ? ' nav-icon--potluck' : ''}`}
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
