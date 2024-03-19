'use client'

import { useTheme } from 'next-themes'
import { useHotkeys } from 'react-hotkeys-hook'

export const HotkeysProvider = () => {
  // theme
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  useHotkeys('m', () => {
    toggleTheme()
  })

  return null
}
