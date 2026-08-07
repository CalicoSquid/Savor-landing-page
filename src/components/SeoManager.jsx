import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { seoForPath, DEFAULT_SOCIAL_IMAGE, SITE_URL } from '../data/seoPages'
import { structuredDataForPage } from '../data/structuredData'

function setMeta(attribute, name, content) {
  let element = document.querySelector(`meta[${attribute}="${name}"]`)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  element.setAttribute('content', content)
  return element
}

function removeMeta(attribute, name) {
  document.querySelector(`meta[${attribute}="${name}"]`)?.remove()
}

function setCanonical(url) {
  let link = document.querySelector('link[rel="canonical"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'canonical')
    document.head.appendChild(link)
  }
  link.setAttribute('href', url)
}

export default function SeoManager() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Shared recipe pages own their metadata after their API payload arrives.
    // Their server shell is noindex and the Netlify edge function handles bots.
    if (pathname.startsWith('/r/')) return

    const seo = seoForPath(pathname)

    if (!seo) {
      document.title = 'Page not found — Savor'
      setMeta('name', 'description', 'This page does not exist on Savor.')
      setMeta('name', 'robots', 'noindex, follow')
      document.querySelector('link[rel="canonical"]')?.remove()
      setMeta('property', 'og:type', 'website')
      setMeta('property', 'og:title', 'Page not found — Savor')
      setMeta('property', 'og:description', 'This page does not exist on Savor.')
      setMeta('property', 'og:url', `${SITE_URL}${pathname}`)
      setMeta('property', 'og:image', DEFAULT_SOCIAL_IMAGE)
      setMeta('name', 'twitter:card', 'summary_large_image')
      document.getElementById('route-jsonld')?.remove()
      removeMeta('property', 'article:published_time')
      removeMeta('property', 'article:modified_time')
      removeMeta('name', 'author')
      return
    }

    document.title = seo.title
    setMeta('name', 'description', seo.description)
    setMeta('name', 'robots', seo.robots)
    setCanonical(seo.canonical)

    setMeta('property', 'og:type', seo.ogType)
    setMeta('property', 'og:site_name', 'Savor')
    setMeta('property', 'og:locale', 'en_GB')
    setMeta('property', 'og:title', seo.title)
    setMeta('property', 'og:description', seo.description)
    setMeta('property', 'og:url', seo.canonical)
    setMeta('property', 'og:image', seo.ogImage)
    setMeta('property', 'og:image:secure_url', seo.ogImage)
    setMeta('property', 'og:image:type', 'image/jpeg')
    setMeta('property', 'og:image:width', String(seo.ogImageWidth))
    setMeta('property', 'og:image:height', String(seo.ogImageHeight))
    setMeta('property', 'og:image:alt', seo.ogImageAlt)

    setMeta('name', 'twitter:card', 'summary_large_image')
    setMeta('name', 'twitter:title', seo.title)
    setMeta('name', 'twitter:description', seo.description)
    setMeta('name', 'twitter:image', seo.ogImage)
    setMeta('name', 'twitter:image:alt', seo.ogImageAlt)

    if (seo.ogType === 'article' && seo.publishedTime) {
      setMeta('property', 'article:published_time', seo.publishedTime)
      setMeta('property', 'article:modified_time', seo.modifiedTime)
      if (seo.author) setMeta('name', 'author', seo.author)
    } else {
      removeMeta('property', 'article:published_time')
      removeMeta('property', 'article:modified_time')
      removeMeta('name', 'author')
    }

    const schema = structuredDataForPage(seo)
    let script = document.getElementById('route-jsonld')
    if (!schema) {
      script?.remove()
    } else {
      if (!script) {
        script = document.createElement('script')
        script.id = 'route-jsonld'
        script.type = 'application/ld+json'
        document.head.appendChild(script)
      }
      script.textContent = JSON.stringify(schema)
    }
  }, [pathname])

  return null
}
