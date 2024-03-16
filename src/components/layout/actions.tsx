'use client'

import { type Session } from 'next-auth'
import { Dropdown } from '~/components/shared/dropdown'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeSwitcher } from '~/components/shared/theme-switcher'

type ActionsProps = {
  session: Session
  signOut: () => void
}

export const Actions = ({ session, signOut }: ActionsProps) => {
  return (
    <div className='z-40 text-neutral-900 dark:text-white'>
      <div className='mx-auto'>
        <div className='flex items-center justify-between pb-2 pt-3 md:pb-3 md:pt-4'>
          <div>
            <Dropdown
              trigger={
                <button className='rounded-full outline-none transition-all focus:ring-2 focus:ring-blue-400'>
                  <Image src={session.user.image!} width={32} height={32} alt='Avatar' className='rounded-full' />
                </button>
              }
              align='end'
            >
              <Dropdown.Item>
                <Link href='/profile'>Profile</Link>
              </Dropdown.Item>
              <Dropdown.Item>
                <form action={signOut}>
                  <button type='submit'>Log out</button>
                </form>
              </Dropdown.Item>
              <ThemeSwitcher />
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  )
}
