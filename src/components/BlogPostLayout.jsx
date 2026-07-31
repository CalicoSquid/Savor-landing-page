// src/components/BlogPostLayout.jsx
// Shared chrome for every blog post: eyebrow, title, byline, the article
// body (passed as children), and a closing CTA back to Savor. Individual
// post files (src/pages/blog/*.jsx) only supply the title/date/readTime and
// their own body content — this keeps every post visually consistent
// without copy-pasting the same header/footer into each one.
//
// Plain <a> tags throughout, not react-router <Link> — same reason as
// Footer.jsx: a client-side SPA navigation often never fires onLoadEnd
// inside Savor's in-app WebView, and a blog post is exactly the kind of
// page that could be opened there.
import '../pages/blog/blog.css'

const PLAY_URL = 'https://play.google.com/store/apps/details?id=com.calicosquid.savorrecipes'

export default function BlogPostLayout({ title, date, readTime, children }) {
  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <main className="page doc-page blog-post-page">
      <div className="doc-inner blog-post-inner">
        <a href="/blog" className="blog-back-link">&larr; All posts</a>

        <span className="doc-eyebrow">Blog</span>
        <h1 className="doc-title blog-post-title">{title}</h1>
        <div className="blog-byline">
          By <a href="/about">Caleb</a> &middot; {displayDate} &middot; {readTime}
        </div>

        <article className="blog-post-body">{children}</article>

        <div className="doc-cta">
          <h2>A home for every recipe that matters.</h2>
          <a href={PLAY_URL} target="_blank" rel="noreferrer" className="doc-cta-badge-link">
            <img
              src="/potluck/play2.webp"
              alt="Get Savor on Google Play"
              className="doc-cta-badge"
              width="440"
              height="121"
              loading="lazy"
              decoding="async"
            />
          </a>
          <a href="/blog" style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'none' }}>
            Read more from the blog &rarr;
          </a>
        </div>
      </div>
    </main>
  )
}