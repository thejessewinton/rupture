import { forwardRef } from 'react'

import { CheckIcon } from '@heroicons/react/24/outline'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'

type CheckboxProps = {
  label: string
} & CheckboxPrimitive.CheckboxProps

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ label, name, ...props }: CheckboxProps, ref) => {
    return (
      <div className='flex items-center justify-center gap-2'>
        <CheckboxPrimitive.Root
          className='h-4 w-4 rounded border border-neutral-200 outline-none focus:ring-1 focus:ring-sky-600/75 dark:border-neutral-800 dark:bg-neutral-700 dark:focus:ring-blue-600 radix-state-checked:dark:bg-neutral-700'
          ref={ref}
          id={name}
          {...props}
        >
          <CheckboxPrimitive.Indicator className='flex items-center justify-center'>
            <CheckIcon className='h-3 w-3' />
          </CheckboxPrimitive.Indicator>
        </CheckboxPrimitive.Root>
        <label className='flex items-center gap-2 text-xs font-light' htmlFor={name}>
          {label}
        </label>
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'
