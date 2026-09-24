import { useState, useEffect, useCallback, useRef } from 'react'
import { ThemeContext } from './themeContext'
import { themes, applyTheme } from './themes'

let animationModulesPromise = null

function loadAnimationModules() {
  if (!animationModulesPromise) {
    animationModulesPromise = Promise.all([
      import('gsap'),
      import('canvas-confetti'),
    ])
  }
  return animationModulesPromise
}

function prefersReducedMotion() {
  return typeof window !== 'undefined'
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
}

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState(themes[0])
  const [burstStyle, setBurstStyle] = useState(null)
  const burstRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => { applyTheme(activeTheme) }, [activeTheme])

  // Warm the animation libraries once the browser is idle. The first theme
  // click still works if this has not completed; the burst is born clipped.
  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const warm = () => { loadAnimationModules().catch(() => {}) }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(warm, { timeout: 2200 })
      return () => window.cancelIdleCallback?.(id)
    }

    const id = window.setTimeout(warm, 900)
    return () => window.clearTimeout(id)
  }, [])

  const selectTheme = useCallback((theme, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2

    setActiveTheme(theme)

    if (prefersReducedMotion()) {
      window.scrollTo({ top: 0, behavior: 'auto' })
      setBurstStyle(null)
      return
    }

    setBurstStyle({
      x,
      y,
      c1: theme.gradient[0],
      c2: theme.gradient[1],
      primary: theme.primary,
      secondary: theme.secondary,
      tertiary: theme.tertiary,
      name: theme.name,
    })
  }, [])

  useEffect(() => {
    if (!burstStyle || !burstRef.current) return undefined
    let cancelled = false

    ;(async () => {
      const [{ gsap }, { default: confetti }] = await loadAnimationModules()
      if (cancelled || !burstRef.current) return

      const { x, y, primary, secondary, tertiary } = burstStyle
      const el = burstRef.current
      const glow = el.querySelector('[data-theme-burst-glow]')
      const ring = el.querySelector('[data-theme-burst-ring]')
      const gleam = el.querySelector('[data-theme-burst-gleam]')
      const ox = Math.min(1, Math.max(0, x / window.innerWidth))
      const oy = Math.min(1, Math.max(0, y / window.innerHeight))
      const radius = Math.hypot(
        Math.max(x, window.innerWidth - x),
        Math.max(y, window.innerHeight - y),
      ) * 1.06

      if (tlRef.current) tlRef.current.kill()
      confetti.reset?.()

      gsap.set(el, {
        clipPath: `circle(0px at ${x}px ${y}px)`,
        opacity: 1,
      })
      gsap.set(glow, { scale: 0.7, opacity: 0.95 })
      gsap.set(ring, { scale: 0.25, opacity: 0.9 })
      gsap.set(gleam, { opacity: 0, scale: 0.82 })

      const tl = gsap.timeline({
        defaults: { overwrite: 'auto' },
      })
      tlRef.current = tl

      tl.to(el, {
        clipPath: `circle(${radius}px at ${x}px ${y}px)`,
        duration: 0.92,
        ease: 'power3.inOut',
      }, 0)
        .to(glow, {
          scale: 1.32,
          opacity: 0.18,
          duration: 0.92,
          ease: 'power2.out',
        }, 0)
        .to(ring, {
          scale: 7.5,
          opacity: 0,
          duration: 0.72,
          ease: 'power2.out',
        }, 0.03)
        .to(gleam, {
          opacity: 0.72,
          scale: 1.06,
          duration: 0.34,
          ease: 'power2.out',
        }, 0.18)
        .to(gleam, {
          opacity: 0,
          scale: 1.22,
          duration: 0.5,
          ease: 'power1.in',
        }, 0.52)
        .add(() => {
          confetti({
            particleCount: 34,
            spread: 88,
            startVelocity: 24,
            origin: { x: ox, y: oy },
            colors: [primary, secondary, tertiary, '#ffffff', '#fff7ed'],
            gravity: 0.72,
            scalar: 0.48,
            drift: 0.15,
            ticks: 135,
            zIndex: 10001,
            disableForReducedMotion: true,
          })
        }, 0.2)
        .add(() => {
          // The flood is fully opaque here, so move to the top while hidden
          // and reveal the newly themed page without the old hard jump.
          window.scrollTo({ top: 0, behavior: 'auto' })
        }, 0.94)
        .to(el, {
          opacity: 0,
          duration: 0.52,
          ease: 'power2.inOut',
          onComplete: () => setBurstStyle(null),
        }, 0.98)
    })().catch(() => {
      // A theme change should never depend on decorative animation code.
      window.scrollTo({ top: 0, behavior: 'auto' })
      setBurstStyle(null)
    })

    return () => {
      cancelled = true
      tlRef.current?.kill()
    }
  }, [burstStyle])

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, selectTheme, themes }}>
      {children}
      {burstStyle && (
        <div
          ref={burstRef}
          className="theme-burst"
          aria-hidden="true"
          style={{
            '--burst-x': `${burstStyle.x}px`,
            '--burst-y': `${burstStyle.y}px`,
            '--burst-c1': burstStyle.c1,
            '--burst-c2': burstStyle.c2,
            '--burst-primary': burstStyle.primary,
            // Hide the layer at creation time so lazy imports can never flash
            // a full-screen block of colour before GSAP initializes it.
            clipPath: `circle(0px at ${burstStyle.x}px ${burstStyle.y}px)`,
          }}
        >
          <div className="theme-burst__glow" data-theme-burst-glow />
          <div className="theme-burst__ring" data-theme-burst-ring />
          <div className="theme-burst__gleam" data-theme-burst-gleam />
        </div>
      )}
    </ThemeContext.Provider>
  )
}
