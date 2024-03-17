import Link from 'next/link'

import { Actions } from '~/components/layout/actions'
import { Navigation } from '~/components/layout/navigation'
import { auth, signOut } from '~/server/auth'

export const Header = async () => {
  const session = await auth()

  return (
    <div className='relative border-b border-neutral-200 px-8 dark:border-neutral-800'>
      <header className=''>
        <div className='mx-auto flex w-full items-center justify-between pb-8 pt-4'>
          <Link href='/'>Rupture</Link>

          <div className='flex items-center gap-2'>
            <Actions
              session={session!}
              signOut={async () => {
                'use server'
                await signOut()
              }}
            />
          </div>
        </div>
        <Navigation />
      </header>
    </div>
  )
}
