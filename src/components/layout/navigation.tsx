'use client'

import { Route } from 'next'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { classNames } from '~/utils/core'

export const Navigation = () => {
  const pathname = usePathname()

  const items: Array<{
    label: string
    href: Route<string>
  }> = [
    {
      label: 'Lifts',
      href: '/'
    },
    { label: 'Profile', href: '/profile' }
  ]

  return (
    <nav className='-mb-px flex overflow-x-auto text-sm'>
      {items.map((item) => {
        return (
          <Link
            href={item.href}
            key={item.href}
            className={classNames('border-b border-transparent px-3 pb-2 pt-1 transition-all', {
              'border-blue-800': pathname === item.href
            })}
          >
            {item.label}
          </Link>
        )
      })}
    </nav>
  )
}
