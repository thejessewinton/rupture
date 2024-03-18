import { type ReactNode } from 'react'

import { XMarkIcon } from '@heroicons/react/24/solid'
import * as DialogPrimitive from '@radix-ui/react-dialog'

import { classNames } from '~/utils/core'

type DialogProps = {
  trigger: ReactNode
  component: ReactNode
  title: string
}

export const Dialog = ({ trigger, title, component }: DialogProps) => {
  return (
    <DialogPrimitive.Root>
      <DialogPrimitive.Trigger asChild>{trigger}</DialogPrimitive.Trigger>
      <DialogPrimitive.Overlay className='fixed inset-0 z-50 bg-black/50 backdrop-blur-sm radix-state-closed:animate-fade-out radix-state-open:animate-fade-in' />
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className={classNames(
            'fixed inset-0 z-[100] flex max-w-full shrink-0 items-center justify-center overflow-hidden outline-none',
            'radix-state-open:animate-scale-in-content',
            'radix-state-closed:animate-scale-out-content'
          )}
        >
          <div className='relative flex w-full max-w-xl flex-col rounded border border-neutral-200 bg-white p-8 shadow-2xl shadow-black/20 dark:border-neutral-800 dark:bg-neutral-900'>
            <div className='mb-2 flex justify-between'>
              <DialogPrimitive.Title>{title}</DialogPrimitive.Title>
              <DialogPrimitive.Close className='self-end rounded p-1 outline-none transition-all hover:bg-neutral-200 hover:dark:bg-neutral-800'>
                <XMarkIcon className='h-4 w-4 text-neutral-800 dark:text-neutral-500' />
              </DialogPrimitive.Close>
            </div>
            {component}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
