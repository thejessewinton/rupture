import { forwardRef, type ComponentPropsWithRef, type Ref } from 'react'

import { classNames } from '~/utils/core'

export type SelectProps = ComponentPropsWithRef<'select'>

export const Select = forwardRef(({ children, className, ...props }: SelectProps, ref: Ref<HTMLSelectElement>) => {
  return (
    <select
      className={classNames(
        'inline-block rounded-sm border border-neutral-200 bg-transparent py-1 pr-4 text-sm font-normal transition autofill:bg-white focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-transparent hover:focus:border-blue-500/50 dark:border-neutral-800',
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </select>
  )
})

Select.displayName = 'Select'
