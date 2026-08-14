import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// React Router keeps the current scroll offset across client-side navigation.
// Full-page destinations on this site should always open from the top.
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}
