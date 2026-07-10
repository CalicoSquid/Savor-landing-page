import { StrictMode } from 'react'
import { hydrateRoot, createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
// Self-hosted Raleway (bundled at build time, served same-origin) — replaces
// the old runtime <link> to fonts.googleapis.com in index.html. That link
// is the exact request that stalled inside Savor's in-app WebView and left
// onLoadEnd never firing (see DemoBlog.jsx, where this was fixed first).
// This is the site-wide font, loaded on every route via this entry point,
// so it needed the same fix — not just the one page it was caught on.
import '@fontsource/raleway/300.css'
import '@fontsource/raleway/400.css'
import '@fontsource/raleway/600.css'
import '@fontsource/raleway/700.css'
import '@fontsource/raleway/800.css'
import AppRoutes from './App'

const root = document.getElementById('root')

const tree = (
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
)

// Hydrate the prerendered HTML when present; fall back to a fresh render
// for SPA-only routes that weren't prerendered.
if (root.hasChildNodes()) {
  hydrateRoot(root, tree)
} else {
  createRoot(root).render(tree)
}