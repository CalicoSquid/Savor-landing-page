import { useState, useEffect, useCallback, useRef } from 'react'
import { gsap } from 'gsap'
import confetti from 'canvas-confetti'
import { ThemeContext } from './themeContext'
import { themes, applyTheme } from './themes'

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState(themes[0])
  const [burstStyle, setBurstStyle] = useState(null)
  const burstRef = useRef(null)
  const tlRef = useRef(null)

  useEffect(() => { applyTheme(activeTheme) }, [activeTheme])

  const selectTheme = useCallback((theme, e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    setActiveTheme(theme)
    setBurstStyle({ x, y, c1: theme.gradient[0], c2: theme.gradient[1] })
  }, [])

  useEffect(() => {
    if (!burstStyle || !burstRef.current) return
    const { x, y} = burstStyle
    const el = burstRef.current
    const ox = x / window.innerWidth
    const oy = y / window.innerHeight

    if (tlRef.current) tlRef.current.kill()

    const tl = gsap.timeline()
    tlRef.current = tl

    tl.fromTo(el,
      { clipPath: `circle(0px at ${x}px ${y}px)`, opacity: 1 },
      { clipPath: `circle(150vmax at ${x}px ${y}px)`, duration: 0.8, ease: 'power4.out' }
    )
      .add(() => {
        window.scrollTo({ top: 0, behavior: 'instant' })
      })
      .add(() => {
        confetti({
          particleCount: 40,
          spread: 80,
          origin: { x: ox, y: oy },
          colors: ['#ffffff', '#ffffffcc', '#ffffffaa'],
          gravity: 0.8,
          scalar: 0.4,
          drift: 0.8,
          ticks: 180,
        })
      })
      .to(el, {
        opacity: 0,
        duration: 1.6,
        ease: 'power1.inOut',
        onComplete: () => setBurstStyle(null)
      })
  }, [burstStyle])

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, selectTheme, themes }}>
      {children}
      {burstStyle && (
        <div ref={burstRef} style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          pointerEvents: 'none',
          background: `linear-gradient(135deg, ${burstStyle.c1}, ${burstStyle.c2})`,
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at ${burstStyle.x}px ${burstStyle.y}px, rgba(255,255,255,0.05) 0%, transparent 60%)`,
          }} />
        </div>
      )}
    </ThemeContext.Provider>
  )
}