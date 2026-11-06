import { useEffect, useState } from 'react'
import './recording-scroll.css'

// Only mounted when explicitly requested with ?record=1.
export default function RecordingScroll() {
  const [take, setTake] = useState(0)
  const [phase, setPhase] = useState('idle')
  const [count, setCount] = useState(3)

  useEffect(() => {
    if (!take) return
    let cancelled = false
    let frame
    const timers = []
    const root = document.documentElement
    const oldBehavior = root.style.scrollBehavior
    root.style.scrollBehavior = 'auto'
    const stop = () => {
      cancelled = true
      cancelAnimationFrame(frame)
      timers.forEach(clearTimeout)
      root.classList.remove('recording-scroll-active')
      root.style.scrollBehavior = oldBehavior
      setPhase('idle')
    }
    const onKey = event => { if (event.key === 'Escape') stop() }
    window.addEventListener('keydown', onKey)
    window.addEventListener('wheel', stop, { passive: true })
    window.addEventListener('touchstart', stop, { passive: true })
    setPhase('preparing')
    const prepare = async () => {
      // Warm the images before moving so lazy loading cannot spoil the take.
      const images = [...document.querySelectorAll('.originals-card img')]
      images.forEach(img => { img.loading = 'eager' })
      await Promise.race([
        Promise.allSettled([document.fonts.ready, ...images.map(img => img.decode())]),
        new Promise(resolve => timers.push(setTimeout(resolve, 8000))),
      ])
      if (cancelled) return
      setPhase('countdown')
      setCount(3)
      timers.push(setTimeout(() => setCount(2), 1000))
      timers.push(setTimeout(() => setCount(1), 2000))
      timers.push(setTimeout(() => {
        if (cancelled) return
        setPhase('recording')
        root.classList.add('recording-scroll-active')
        const from = window.scrollY
        const to = Math.min(from + window.innerHeight * 1.6, root.scrollHeight - window.innerHeight)
        let start
        const step = time => {
          if (cancelled) return
          start ??= time
          const progress = Math.min((time - start) / 10000, 1)
          // Gentle acceleration and deceleration with a steady middle.
          const eased = progress * progress * (3 - 2 * progress)
          window.scrollTo(0, from + (to - from) * eased)
          if (progress < 1) frame = requestAnimationFrame(step)
          else timers.push(setTimeout(stop, 1200))
        }
        frame = requestAnimationFrame(step)
      }, 3000))
    }
    prepare()
    return () => {
      stop()
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('wheel', stop)
      window.removeEventListener('touchstart', stop)
    }
  }, [take])

  return (
    <aside className="recording-scroll" hidden={phase === 'recording'} aria-label="Screen recording controls">
      <strong>Savor Originals · recording mode</strong>
      <p role="status">{phase === 'preparing' ? 'Preparing images…' : phase === 'countdown' ? `Starting in ${count}…` : '10-second scroll from your current position. Escape to stop.'}</p>
      <button disabled={phase !== 'idle'} onClick={() => setTake(value => value + 1)}>Start take</button>
      <button disabled={phase !== 'idle'} onClick={() => window.scrollTo({ top: 0, behavior: 'instant' })}>Back to top</button>
    </aside>
  )
}
