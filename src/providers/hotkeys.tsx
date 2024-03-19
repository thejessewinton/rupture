'use client'

import { useTheme } from 'next-themes'
import { useHotkeys } from 'react-hotkeys-hook'

import { LiftForm } from '~/components/lifts/lift-form'
import { useDialogStore } from '~/state/use-dialog-store'

export const HotkeysProvider = () => {
  const { handleDialog } = useDialogStore()
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  useHotkeys('m', () => {
    toggleTheme()
  })

  useHotkeys('l', () => {
    handleDialog({
      title: 'Add lift',
      component: <LiftForm />
    })
  })

  return null
}
