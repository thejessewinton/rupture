import { type ReactNode } from 'react'
import { redirect } from 'next/navigation'

import { Header } from '~/components/layout/header'
import { auth } from '~/server/auth'

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await auth()

  if (!session) {
    redirect('/login')
  }

  return (
    <>
      <div className='relative mx-auto flex-1'>
        <Header />
        <div className='mx-auto w-full max-w-6xl p-8'>{children}</div>
      </div>
    </>
  )
}
