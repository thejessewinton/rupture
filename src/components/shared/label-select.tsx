import { forwardRef, type Ref } from 'react'

import { Select, type SelectProps } from '~/components/shared/select'
import { classNames } from '~/utils/core'

type LabelSelectProps = SelectProps & {
  label: string
}

export const LabelSelect = forwardRef(
  ({ children, className, label, name, ...props }: LabelSelectProps, ref: Ref<HTMLDivElement>) => {
    return (
      <div
        className={classNames(
          'rounded-xs text-primary flex items-stretch rounded border border-neutral-200 text-xs shadow-sm transition-all focus-within:ring-1 dark:border-neutral-700',
          className
        )}
        ref={ref}
      >
        <label
          htmlFor={name}
          className='rounded-l-xs mb-0 flex items-center whitespace-nowrap border-r border-neutral-200 px-1.5 py-1 font-medium dark:border-neutral-700 dark:bg-neutral-800'
        >
          {label}
        </label>
        <Select
          name={name}
          id={name}
          className='rounded-r-xs block w-full rounded-l-none border-0 pl-2 shadow-none outline-none focus:ring-0'
          {...props}
        >
          {children}
        </Select>
      </div>
    )
  }
)

LabelSelect.displayName = 'LabelSelect'
