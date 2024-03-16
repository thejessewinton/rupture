import { type ReactNode } from 'react'

export const EmptyState = ({ children }: { children: ReactNode }) => {
  return (
    <div className='flex min-h-96 w-full items-center justify-center border border-neutral-200 dark:border-neutral-800'>
      <div className='flex items-center gap-2'>{children}</div>
    </div>
  )
}
