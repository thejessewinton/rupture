'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'

import { useDialogStore } from '~/state/use-dialog-store'
import { classNames } from '~/utils/core'
import { XMarkIcon } from '@heroicons/react/24/solid'

export const Dialog = () => {
  const { isOpen, onClose, dialogTitle, dialogContent } = useDialogStore()

  return (
    <DialogPrimitive.Root open={isOpen} onOpenChange={onClose}>
      <DialogPrimitive.Overlay className='radix-state-open:animate-fade-in radix-state-closed:animate-fade-out fixed inset-0 bg-black/50 backdrop-blur-sm' />
      <DialogPrimitive.Portal>
        <DialogPrimitive.Content
          className={classNames(
            'fixed inset-0 z-[100] flex max-w-full shrink-0 items-start justify-center overflow-hidden outline-none',
            'radix-state-open:animate-scale-in-content',
            'radix-state-closed:animate-scale-out-content'
          )}
        >
          <div className='relative mt-[15vh] flex w-full max-w-2xl flex-col rounded bg-neutral-900 px-4 pb-4 pt-2 shadow-2xl shadow-black/20'>
            <DialogPrimitive.Title className='sr-only'>{dialogTitle}</DialogPrimitive.Title>
            <DialogPrimitive.Close className='self-end rounded p-1 outline-none transition-all hover:bg-neutral-800'>
              <XMarkIcon className='h-4 w-4 text-neutral-500' />
            </DialogPrimitive.Close>
            {dialogContent}
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  )
}
