import type { InputHTMLAttributes, ReactNode } from 'react'
import { forwardRef } from 'react'

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label: ReactNode
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ label, ...rest }: CheckboxProps, ref) => {
  return (
    <label className='flex items-center gap-2 text-xs font-light'>
      <input
        type='checkbox'
        {...rest}
        ref={ref}
        className='h-4 w-4 appearance-none rounded border border-neutral-200 checked:bg-checkmark focus:ring-1 focus:ring-sky-600/75 dark:border-neutral-800 dark:bg-neutral-700 checked:dark:bg-neutral-700 dark:focus:ring-blue-600'
      />
      {label}
    </label>
  )
})

Checkbox.displayName = 'Checkbox'
