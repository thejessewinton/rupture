import { type ReactNode } from 'react'

import { Header } from '~/components/layout/header'

export default function IndexLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className='relative mx-auto flex-1'>
        <Header />
        <main className='mx-auto w-full max-w-5xl p-8'>{children}</main>
      </div>
    </>
  )
}
