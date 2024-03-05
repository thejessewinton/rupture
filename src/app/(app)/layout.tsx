import { type ReactNode } from 'react'
import { Header } from '~/components/layout/header'
import { Sidebar } from '~/components/layout/sidebar'

export default async function IndexLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Sidebar />
      <div className='relative mx-auto flex-1'>
        <Header />
        <main className='mx-auto w-full max-w-4xl px-8 pt-8'>{children}</main>
      </div>
    </>
  )
}
