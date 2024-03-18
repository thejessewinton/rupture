'use client'

import Link from 'next/link'

import { type Session } from 'next-auth'

import { Dropdown, DropdownItem } from '~/components/shared/dropdown'
import { ThemeSwitcher } from '~/components/shared/theme-switcher'
import { getFirstInitial } from '~/utils/core'

type ActionsProps = {
  session: Session
  signOut: () => Promise<void>
}

export const Actions = ({ session, signOut }: ActionsProps) => {
  return (
    <div className='z-40 text-neutral-900 dark:text-white'>
      <div className='mx-auto'>
        <div className='flex items-center justify-between pb-2 pt-3 md:pb-3 md:pt-4'>
          <div>
            <Dropdown
              trigger={
                <button className='relative flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 outline-none transition-all focus:ring-2 focus:ring-blue-400 dark:border-neutral-800'>
                  {getFirstInitial(session.user?.name ?? '')}
                </button>
              }
              align='end'
            >
              <DropdownItem>
                <Link href='/profile' className='w-full'>
                  Profile
                </Link>
              </DropdownItem>
              <DropdownItem>
                <button formAction={signOut} className='w-full text-left'>
                  Log out
                </button>
              </DropdownItem>
              <ThemeSwitcher />
            </Dropdown>
          </div>
        </div>
      </div>
    </div>
  )
}
