import { auth, signOut } from '~/server/auth'
import { Actions } from './actions'
import { Navigation } from './navigation'
import Link from 'next/link'

export const Header = async () => {
  const session = await auth()

  return (
    <div className='relative border-b border-neutral-200 px-8 dark:border-neutral-800'>
      <header className=''>
        <div className='mx-auto flex w-full items-center justify-between pb-8 pt-4'>
          <Link href='/'>Rupture</Link>
          <Actions
            session={session!}
            signOut={async () => {
              'use server'
              return await signOut()
            }}
          />
        </div>
        <Navigation />
      </header>
    </div>
  )
}
