import * as DropdownPrimitive from '@radix-ui/react-dropdown-menu'
import { type ReactNode } from 'react'
import { classNames } from '~/utils/core'

type DropdownProps = {
  trigger: ReactNode
  children: ReactNode
  align?: DropdownPrimitive.MenuContentProps['align']
}

export const Dropdown = ({ trigger, children, align }: DropdownProps) => {
  return (
    <DropdownPrimitive.Root>
      <DropdownPrimitive.Trigger className='flex cursor-pointer items-center gap-2 focus-within:rounded-full' asChild>
        {trigger}
      </DropdownPrimitive.Trigger>
      <DropdownPrimitive.Portal>
        <DropdownPrimitive.Content
          align={align}
          className={classNames(
            'relative z-50 mt-1 min-w-32 space-y-2 rounded border border-neutral-800 bg-neutral-900 p-2 transition-colors',
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

Dropdown.Item = ({ className, ...props }: DropdownItemProps) => {
  return (
    <DropdownPrimitive.Item
      className={classNames(
        'flex cursor-pointer rounded px-3 py-1 text-xs text-neutral-400 transition-colors focus:bg-neutral-800 focus:outline-none',
        className
      )}
      {...props}
    />
  )
}
