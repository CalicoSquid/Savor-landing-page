// src/components/Footer.jsx
// Footer uses plain <a> anchors, not React Router <Link>, deliberately:
// inside Savor's in-app WebView a client-side SPA navigation often never
// fires onLoadEnd (eternal loading spinner), and also preserves scroll
// position from the previous page. Real anchor navigations avoid both --
// they do a full document load that starts at the top. The minor cost is a
// full reload for normal web visitors on footer clicks, negligible here.

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-inner">
        <ul className="site-footer-links">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li><a href="/faq">FAQ</a></li>
          <li><a href="/potluck">Potluck</a></li>
          <li><a href="/forage">Forage</a></li>
          <li><a href="/demo">Demo</a></li>
          <li><a href="/privacy">Privacy</a></li>
          <li><a href="/terms">Terms</a></li>
        </ul>
        <a href="/studio" className="site-footer-mark">
          calicoSquid<span className="code">Code</span>
        </a>
      </div>
    </footer>
  )
}