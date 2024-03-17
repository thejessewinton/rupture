'use client'

import { type ReactNode } from 'react'

import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'

import { classNames } from '~/utils/core'

type DropdownProps = {
  trigger: ReactNode
  children: ReactNode
  align?: DropdownPrimitive.MenuContentProps['align']
}

export const Dropdown = ({ trigger, children, align }: DropdownProps) => {
  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger className='flex cursor-pointer items-center gap-2' asChild>
        {trigger}
      </DropdownPrimitive.Trigger>
      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
          align={align}
          className={classNames(
            'relative z-50 mt-1 min-w-32 space-y-2 rounded border border-neutral-200 bg-white p-2 transition-colors dark:border-neutral-800 dark:bg-neutral-900',
            'radix-state-open:animate-scale-in-content',
            'radix-state-closed:animate-scale-out-content'
          )}
        >
          {children}
        </DropdownPrimitive.Content>
      </DropdownPrimitive.Portal>
    </DropdownPrimitive.Root>
  )
}

type DropdownItemProps = DropdownPrimitive.DropdownMenuItemProps

export const Item = ({ className, ...props }: DropdownItemProps) => {
  return (
    <DropdownPrimitive.Item
      className={classNames(
        'flex cursor-pointer rounded px-3 py-1 text-xs text-neutral-800 transition-colors focus:bg-neutral-50 focus:outline-none dark:text-neutral-400 focus:dark:bg-neutral-800',
        className
      )}
      {...props}
    />
  )
}

Item.displayName = 'Dropdown.Item'
