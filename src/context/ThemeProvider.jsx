import { useState, useEffect } from 'react'
import { ThemeContext } from './themeContext'
import { themes, applyTheme } from './themes'

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState(themes[0])

  useEffect(() => { applyTheme(activeTheme) }, [activeTheme])

  return (
    <ThemeContext.Provider value={{ activeTheme, setActiveTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  )
}