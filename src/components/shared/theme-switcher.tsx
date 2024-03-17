'use client'

import { useEffect, useState, type ChangeEvent } from 'react'

import { useTheme } from 'next-themes'

import { LabelSelect } from '~/components/shared/label-select'

export const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <LabelSelect className='inline-flex' label='Theme' name='theme' defaultValue='system'>
        <option value='system'>System</option>
        <option value='light'>Light</option>
        <option value='dark'>Dark</option>
      </LabelSelect>
    )
  }

  return (
    <LabelSelect
      className='inline-flex'
      label='Theme'
      name='theme'
      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
        setTheme(e.target.value)
      }}
      value={theme ?? 'system'}
    >
      <option value='system'>System</option>
      <option value='light'>Light</option>
      <option value='dark'>Dark</option>
    </LabelSelect>
  )
}
