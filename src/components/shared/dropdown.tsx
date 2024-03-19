'use client'

import { forwardRef, type ReactNode, type Ref } from 'react'

import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'

import { classNames } from '~/utils/core'
import { Dialog } from './dialog'

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

export const DropdownItem = forwardRef(
  ({ className, asChild = true, ...props }: DropdownItemProps, ref: Ref<HTMLDivElement>) => {
    return (
      <DropdownPrimitive.Item
        ref={ref}
        className={classNames(
          'flex cursor-pointer rounded px-3 py-1 text-xs text-neutral-800 transition-colors focus:bg-neutral-50 focus:outline-none dark:text-neutral-400 focus:dark:bg-neutral-800',
          className
        )}
        asChild={asChild}
        {...props}
      />
    )
  }
)

DropdownItem.displayName = 'DropdownItem'

type DropdownDialogItemProps = {
  component: ReactNode
  title: string
  label: string
} & DropdownPrimitive.DropdownMenuItemProps

export const DropdownDialogItem = forwardRef(
  ({ className, component, title, label, onSelect, ...props }: DropdownDialogItemProps, ref: Ref<HTMLDivElement>) => {
    return (
      <Dialog
        title={title}
        trigger={
          <DropdownPrimitive.Item
            ref={ref}
            className={classNames(
              'flex cursor-pointer rounded px-3 py-1 text-xs text-neutral-800 transition-colors focus:bg-neutral-50 focus:outline-none dark:text-neutral-400 focus:dark:bg-neutral-800',
              className
            )}
            onSelect={(event) => {
              event.preventDefault()
              onSelect?.(event)
            }}
            {...props}
          >
            {label}
          </DropdownPrimitive.Item>
        }
        component={component}
      />
    )
  }
)

DropdownDialogItem.displayName = 'DropdownDialog'
