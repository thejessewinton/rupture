import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, ...rest }: CheckboxProps, ref: React.Ref<HTMLInputElement>) => {
    return (
      <label className='flex items-center space-x-2 text-2xs font-light'>
        <input
          type='checkbox'
          {...rest}
          ref={ref}
          className='h-4 w-4 appearance-none rounded border bg-neutral-700 checked:bg-neutral-700 checked:bg-checkmark focus:ring-1 focus:ring-sky-600/75 dark:border-neutral-200 dark:border-neutral-800 dark:focus:ring-blue-600'
        />
        {label}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
