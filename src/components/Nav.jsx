// src/components/Nav.jsx
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'

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
        <ul className="nav-links">
          <li><NavLink to="/" end>Savor</NavLink></li>
          <li><NavLink to="/potluck">Potluck</NavLink></li>
          <li><NavLink to="/studio">Studio</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}