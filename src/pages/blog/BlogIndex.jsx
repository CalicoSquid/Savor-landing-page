// src/pages/blog/BlogIndex.jsx
import '../pages.css'
import './blog.css'
import Footer from '../../components/Footer'
import { BLOG_POSTS } from '../../data/blogPosts'

export default function BlogIndex() {

  return (
    <>
      <main className="page doc-page">
        <div className="doc-inner">
          <span className="doc-eyebrow">Blog</span>
          <h1 className="doc-title">Notes on cooking, paper, and screens.</h1>
          <p className="doc-lead">
            Occasional writing from the kitchen where Savor gets made — mostly about
            recipes worth keeping, and the tools (paper or otherwise) that actually
            keep them.
          </p>

          <div className="blog-index-list">
            {BLOG_POSTS.map((post) => (
              <a
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="blog-index-card"
              >
                <span className="blog-index-card-meta">
                  <time dateTime={post.date}>{new Date(post.date + 'T00:00:00').toLocaleDateString('en-GB', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}</time>
                  {' '}&middot;{' '}{post.readTime}
                </span>
                <h2 className="blog-index-card-title">{post.title}</h2>
                <p className="blog-index-card-dek">{post.dek}</p>
                <span className="blog-index-card-link">Read &rarr;</span>
              </a>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}