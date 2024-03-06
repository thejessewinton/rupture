import Link from 'next/link'

import { auth, signOut } from '~/server/auth'
import { Actions } from '~/components/layout/actions'

import { Cog8ToothIcon, HomeIcon, FolderIcon } from '@heroicons/react/24/outline'
import { type Route } from 'next'
import { type ReactNode } from 'react'
import { WeightUnitSwitcher } from '../settings/weight-unit-switcher'

const items: {
  label: string
  href: Route<string>
  icon: ReactNode
}[] = [{ label: 'Overview', href: '/', icon: <HomeIcon className='h-4 w-4' /> }]

export const Sidebar = async () => {
  const session = await auth()

  return (
    <div className='sticky top-0 flex h-screen w-60 flex-col space-y-4 border-r border-neutral-200 px-3 drop-shadow-sm backdrop-blur-sm dark:border-neutral-800'>
      <Actions
        session={session!}
        signOut={async () => {
          'use server'
          return await signOut()
        }}
      />
      <div className='flex flex-1 flex-col gap-2 text-xs text-neutral-300'>
        {items.map((item) => {
          return (
            <Link
              href={item.href}
              key={item.label}
              className='flex w-full items-center gap-2 rounded px-3 py-2 transition-colors hover:bg-neutral-900'
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
