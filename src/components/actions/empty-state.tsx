import { type ReactNode } from 'react'

export const EmptyState = ({ children }: { children: ReactNode }) => {
  return (
    <div className='relative flex min-h-96 w-full items-center justify-center rounded border border-neutral-200 dark:border-neutral-800'>
      <div className='absolute right-0 top-0 h-[1px] w-80 bg-gradient-to-r from-transparent via-neutral-700 to-transparent' />
      <div className='flex items-center gap-2'>{children}</div>
    </div>
  )
}
