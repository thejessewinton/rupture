import { type ReactNode } from 'react'

import { Header } from '~/components/layout/header'

export default async function AppLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className='relative mx-auto flex-1'>
        <Header />
        <div className='mx-auto w-full max-w-6xl p-8'>{children}</div>
      </div>
    </>
  )
}
