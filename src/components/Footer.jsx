// src/components/Footer.jsx
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <ul className="site-footer-links">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/faq">FAQ</Link></li>
          <li><Link to="/potluck">Potluck</Link></li>
          <li><Link to="/forage">Forage</Link></li>
          <li><Link to="/privacy">Privacy</Link></li>
          <li><Link to="/terms">Terms</Link></li>
        </ul>
        <Link to="/studio" className="site-footer-mark">
          calicoSquid<span className="code">Code</span>
        </Link>
      </div>
    </footer>
  )
}