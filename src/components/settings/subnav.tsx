'use client'

import { type Route } from 'next'
import Link from 'next/link'

const items: { label: string; href: Route<string> }[] = [
  {
    label: 'Team',
    href: '/settings/team'
  },
  {
    label: 'Domains',
    href: '/settings/team'
  }
]

export const SubNav = () => {
  return (
    <nav className='flex items-center gap-3'>
      {items.map((item) => (
        <Link key={item.label} href={item.href}>
          {item.label}
        </Link>
      ))}
    </nav>
  )
}
