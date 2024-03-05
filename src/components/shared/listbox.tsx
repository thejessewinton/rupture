import * as SelectPrimitive from '@radix-ui/react-select'
import { type ReactNode } from 'react'
import { classNames } from '~/utils/core'
import { CheckIcon } from '@heroicons/react/24/solid'

type SelectProps = {
  label: string
  placeholder: string
  icon?: ReactNode
} & SelectPrimitive.SelectProps

export const Listbox = ({ label, placeholder, icon, children, ...props }: SelectProps) => {
  return (
    <div className='relative'>
      <SelectPrimitive.Root {...props}>
        <SelectPrimitive.Trigger
          aria-label={label}
          className='flex items-center gap-2 rounded border-neutral-700 bg-neutral-800 px-2 py-1 text-xs text-neutral-400 transition-all'
        >
          <SelectPrimitive.Icon className='text-primary flex shrink-0 items-center gap-2 self-center'>
            {icon ? <span>{icon}</span> : null}
          </SelectPrimitive.Icon>
          <SelectPrimitive.Value placeholder={placeholder} />
        </SelectPrimitive.Trigger>
        <SelectPrimitive.Content position='popper'>
          <SelectPrimitive.Viewport
            className={classNames(
              'max-h-30 absolute mt-2 w-full min-w-[125px] cursor-pointer space-y-2 overflow-auto rounded bg-neutral-900 px-2 py-1 text-xs text-neutral-600 shadow-lg shadow-black/75 outline-none',
              'radix-state-open:animate-scale-in-content',
              'radix-state-closed:animate-scale-out-content'
            )}
          >
            {children}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Root>
    </div>
  )
}

Listbox.Option = ({ value, label }: SelectPrimitive.SelectItemProps & { label: string }) => {
  return (
    <SelectPrimitive.Item
      value={value}
      className='flex w-full cursor-pointer items-center justify-between rounded border-0 px-1.5 py-1 text-neutral-200 outline-none transition-all hover:bg-neutral-700 hover:ring-0'
    >
      <SelectPrimitive.ItemText>{label}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className='absolute right-3 inline-flex w-4 items-center justify-center'>
        <CheckIcon className='h-3 w-3 text-neutral-600' />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}
