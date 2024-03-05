'use client'

import { type Session } from 'next-auth'
import { Dropdown } from '~/components/shared/dropdown'
import Image from 'next/image'
import Link from 'next/link'
import { getInitials } from '~/utils/core'

type ActionsProps = {
  session: Session
  signOut: () => void
}

export const Actions = ({ session, signOut }: ActionsProps) => {
  return (
    <div className='z-40 px-3 text-neutral-900 dark:text-white'>
      <header className='mx-auto'>
        <div className='flex items-center justify-between pb-2 pt-3 md:pb-3 md:pt-4'>
          <div className='mr-1 flex shrink-0 items-center justify-center gap-2'>
            <Link
              href='/'
              className='leading-0 flex h-5 w-5 items-center justify-center rounded-sm bg-green-800 text-xs'
            >
              {getInitials(session.user.name!)}
            </Link>
            <div className='flex items-center pb-2 pt-3 text-sm text-neutral-200'>{session.user.name}</div>
          </div>
          <div>
            <Dropdown
              trigger={
                <button className='rounded-full outline-none transition-all focus:ring-2 focus:ring-blue-400'>
                  <Image src={session.user.image!} width={20} height={20} alt='Avatar' className='rounded-full' />
                </button>
              }
              align='start'
            >
              <Dropdown.Item>
                <Link href='/profile'>Profile</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <form action={signOut}>
                  <button type='submit'>Log out</button>
                </form>
              </Dropdown.Item>
            </Dropdown>
          </div>
        </div>
      </header>
    </div>
  )
}
