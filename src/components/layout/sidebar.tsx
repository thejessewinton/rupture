import Link from 'next/link'

import { auth, signOut } from '~/server/auth'
import { Actions } from '~/components/layout/actions'

import { Cog8ToothIcon, HomeIcon, FolderIcon } from '@heroicons/react/24/outline'
import { type Route } from 'next'
import { type ReactNode } from 'react'

const items: {
  label: string
  href: Route<string>
  icon: ReactNode
}[] = [
  { label: 'Overview', href: '/', icon: <HomeIcon className='h-4 w-4' /> },
  {
    label: 'Projects',
    href: '/projects',
    icon: <FolderIcon className='h-4 w-4' />
  },
  {
    label: 'Settings',
    href: '/settings/team',
    icon: <Cog8ToothIcon className='h-4 w-4' />
  }
]

export const Sidebar = async () => {
  const session = await auth()

  return (
    <div className='sticky top-0 h-screen w-60 space-y-4 border-r border-neutral-800 px-3 drop-shadow-sm backdrop-blur-sm'>
      <Actions
        session={session!}
        signOut={async () => {
          'use server'
          return await signOut()
        }}
      />
      <div className='flex flex-col gap-2 text-xs text-neutral-300'>
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
