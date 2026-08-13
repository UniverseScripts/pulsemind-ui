import { useEffect, useState } from 'react'

export type Theme = 'day' | 'night'

const STORAGE_KEY = 'pulsemind-theme'

/**
 * Day or night theme.
 *
 * Light is the default and it is never switched automatically. An ICU is a lit room
 * around the clock, so a dark screen in a bright bay is its own legibility problem —
 * night mode is a choice the clinician makes, not something inferred from the hour or
 * from an OS preference.
 */
export function useTheme(): [Theme, () => void] {
  const [theme, setTheme] = useState<Theme>(() => {
    return window.localStorage.getItem(STORAGE_KEY) === 'night' ? 'night' : 'day'
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'night')
    window.localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  function toggle() {
    setTheme((current) => (current === 'day' ? 'night' : 'day'))
  }

  return [theme, toggle]
}
