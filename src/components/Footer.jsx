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
          <li><a href="/about/">About</a></li>
          <li><a href="/blog/">Blog</a></li>
          <li><a href="/recipes/">Recipes</a></li>
          <li><a href="/faq/">FAQ</a></li>
          <li><a href="/iron-kitchen/">Savor × Iron Kitchen</a></li>
          <li><a href="/potluck/">Potluck</a></li>
          <li><a href="/caper/">Caper</a></li>
          <li><a href="/apocaleaf/">Apocaleaf</a></li>
          <li><a href="/demo/">Recipe import demo</a></li>
          <li><a href="/privacy/">Privacy</a></li>
          <li><a href="/terms/">Terms</a></li>
          <li><a href="https://seoreceipts.com/site/getsavor/?ref=badge&amp;utm_source=embed&amp;utm_medium=badge&amp;utm_campaign=status-founding" rel="nofollow sponsored noopener" target="_blank" title="View getsavor.recipes's Google Search Console stats"><img src="https://seoreceipts.com/api/badge?slug=getsavor&amp;mode=founding&amp;theme=paper&amp;size=compact" alt="Google Search Console stats for getsavor.recipes" width="180" height="44" loading="lazy" decoding="async"/></a></li>
        </ul>
        <div className="site-footer-end">
          <div className="site-footer-social">
            <a href="https://www.instagram.com/savor_recipeapp/" target="_blank" rel="noreferrer" aria-label="Savor on Instagram">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <rect x="3" y="3" width="18" height="18" rx="5.5" />
                <circle cx="12" cy="12" r="4.3" />
                <circle cx="17.3" cy="6.7" r="0.4" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a href="https://uk.pinterest.com/cookincolor/" target="_blank" rel="noreferrer" aria-label="Savor on Pinterest">
              <svg viewBox="0 0 24 24" width="20" height="20">
                <circle cx="12" cy="12" r="9.3" fill="none" stroke="currentColor" strokeWidth="1.7" />
                <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="700" fill="currentColor">P</text>
              </svg>
            </a>
          </div>
          <a href="/studio/" className="site-footer-mark">
            calicoSquid<span className="code">Code</span>
          </a>
        </div>
      </div>
    </footer>
  )
}