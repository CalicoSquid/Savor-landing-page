// src/components/Nav.jsx
import { NavLink, useLocation } from 'react-router-dom'
import { useTheme } from '../context/useTheme'
import { getIcon } from '../utils/themeUtils'

export default function Nav() {
  const { activeTheme } = useTheme()
  const location = useLocation() // Get the current location

  const isStudio = location.pathname.startsWith('/studio')

  return (
    // Set a data attribute based on the active page
    <nav className="nav" data-nav-theme={isStudio ? 'studio' : 'savor'}>
      <div className="container">
        <NavLink to="/">
          <img
            // Savor gets the fruit icon, Studio gets the squid icon
            src={isStudio ? '/images/logo_W.png' : getIcon(activeTheme.name)}
            alt={isStudio ? 'CalicoSquid Code' : activeTheme.name}
            className="nav-icon"
          />
        </NavLink>
        <ul className="nav-links">
          {/* Savor path, exact match only */}
          <li><NavLink to="/" end>App</NavLink></li>
          {/* Studio path */}
          <li><NavLink to="/studio">Studio</NavLink></li>
        </ul>
      </div>
    </nav>
  )
}