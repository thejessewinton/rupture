import { forwardRef, type InputHTMLAttributes, type Ref } from 'react'

import { classNames } from '~/utils/core'

type InputProps = {
  label?: string
  secondaryLabel?: string
} & InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef(
  ({ name, className, label, onChange, secondaryLabel, ...rest }: InputProps, ref: Ref<HTMLInputElement>) => {
    return (
      <div className={classNames('relative flex flex-col gap-2', className)}>
        {label && (
          <div className='flex gap-2'>
            <label htmlFor={name} className='text-xs'>
              {label}
            </label>

            {secondaryLabel && <p className='block text-xs text-neutral-500'>— {secondaryLabel}</p>}
          </div>
        )}

        <input
          ref={ref}
          name={name}
          onChange={onChange}
          className={classNames(
            'h-fit w-full appearance-none rounded border border-neutral-200 bg-transparent px-3 py-1.5 text-sm font-light outline-none transition-all placeholder:text-neutral-500 read-only:cursor-not-allowed focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-800',
            className
          )}
          {...rest}
        />
      </div>
    )
  }
)

Input.displayName = 'Input'
