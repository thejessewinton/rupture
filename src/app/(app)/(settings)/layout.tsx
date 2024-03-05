import { type ReactNode } from 'react'
import { SubNav } from '~/components/settings/subnav'

export default async function SettingsLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SubNav />
      {children}
    </>
  )
}
