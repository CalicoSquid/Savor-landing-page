import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from 'react'
import { ThemeContext } from './themeContext'
import { themes, applyTheme } from './themes'

const PREFERENCE_KEY = 'savor-theme-session'
const themeListeners = new Set()
let memoryTheme = themes[0]
let animationModulesPromise = null

function subscribeToTheme(listener) {
  themeListeners.add(listener)
  return () => themeListeners.delete(listener)
}

function readTheme() {
  if (typeof window === 'undefined') return themes[0]
  try {
    const name = window.sessionStorage.getItem(PREFERENCE_KEY)
    return name ? themes.find(theme => theme.name === name) || themes[0] : memoryTheme
  } catch { return memoryTheme }
}

function rememberTheme(theme) {
  memoryTheme = theme
  try { window.sessionStorage.setItem(PREFERENCE_KEY, theme.name) } catch { /* Browsing still works when storage is blocked. */ }
  for (const listener of themeListeners) listener()
}

function defaultTheme() { return themes[0] }

function loadAnimationModules() {
  if (!animationModulesPromise) {
    animationModulesPromise = Promise.all([import('gsap'), import('canvas-confetti')])
  }
  return animationModulesPromise
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function ThemeProvider({ children }) {
  // The hydration snapshot matches prerendered Tangerine; the tab preference
  // is restored after hydration without mismatching the server HTML.
  const activeTheme = useSyncExternalStore(subscribeToTheme, readTheme, defaultTheme)
  const [burstStyle, setBurstStyle] = useState(null)
  const burstRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => { applyTheme(activeTheme) }, [activeTheme])

  useEffect(() => {
    if (typeof window === 'undefined' || prefersReducedMotion()) return undefined
    const warm = () => { loadAnimationModules().catch(() => {}) }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, { timeout: 2200 })
      return () => window.cancelIdleCallback?.(id)
    }
    const id = window.setTimeout(warm, 900)
    return () => window.clearTimeout(id)
  }, [])

  const selectTheme = useCallback((theme, event) => {
    if (theme.name === activeTheme.name && !burstStyle) return
    if (prefersReducedMotion()) {
      rememberTheme(theme)
      setBurstStyle(null)
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    setBurstStyle({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2, theme })
  }, [activeTheme.name, burstStyle])

  useEffect(() => {
    if (!burstStyle || !burstRef.current) return undefined
    let cancelled = false
    ;(async () => {
      const [{ gsap }, { default: confetti }] = await loadAnimationModules()
      if (cancelled || !burstRef.current) return
      const { x, y, theme } = burstStyle
      if (prefersReducedMotion()) {
        rememberTheme(theme)
        setBurstStyle(null)
        return
      }
      const el = burstRef.current
      const radius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y)) * 1.06
      tlRef.current?.kill()
      confetti.reset?.()
      gsap.set(el, { clipPath: `circle(0px at ${x}px ${y}px)`, opacity: 1 })
      const tl = gsap.timeline({ defaults: { overwrite: 'auto' } })
      tlRef.current = tl
      tl.to(el, { clipPath: `circle(${radius}px at ${x}px ${y}px)`, duration: 0.5, ease: 'power2.inOut' })
        .add(() => {
          // Commit only when the coloured layer covers the viewport, so the
          // underlying page never snaps before the reveal. Keep scroll/focus.
          rememberTheme(theme)
          confetti({ particleCount: 18, spread: 65, startVelocity: 16,
            origin: { x: Math.min(1, Math.max(0, x / window.innerWidth)), y: Math.min(1, Math.max(0, y / window.innerHeight)) },
            colors: [theme.primary, theme.secondary, theme.tertiary], gravity: 0.85,
            scalar: 0.45, ticks: 65, zIndex: 10001, disableForReducedMotion: true })
        })
        .to(el, { opacity: 0, duration: 0.3, ease: 'power2.out', onComplete: () => setBurstStyle(null) })
    })().catch(() => {
      if (cancelled) return
      rememberTheme(burstStyle.theme)
      setBurstStyle(null)
    })
    return () => { cancelled = true; tlRef.current?.kill() }
  }, [burstStyle])

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme: rememberTheme, selectTheme, themes }}>
      {children}
      {burstStyle && (
        <div ref={burstRef} className="theme-burst" aria-hidden="true" style={{
          '--burst-x': `${burstStyle.x}px`, '--burst-y': `${burstStyle.y}px`,
          '--burst-c1': burstStyle.theme.gradient[0], '--burst-c2': burstStyle.theme.gradient[1],
          '--burst-primary': burstStyle.theme.primary,
          clipPath: `circle(0px at ${burstStyle.x}px ${burstStyle.y}px)`,
        }} />
      )}
    </ThemeContext.Provider>
  )
}
