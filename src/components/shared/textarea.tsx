import { forwardRef, type ComponentPropsWithRef, type Ref } from 'react'

import { classNames } from '~/utils/core'

export type TextAreaProps = ComponentPropsWithRef<'textarea'>

export const TextArea = forwardRef(({ className, ...props }: TextAreaProps, ref: Ref<HTMLTextAreaElement>) => {
  return (
    <textarea
      className={classNames(
        'h-fit w-full appearance-none border-0 bg-transparent px-3 py-1.5 text-lg text-neutral-500 outline-none ring-0 transition-all placeholder:text-neutral-500 read-only:cursor-not-allowed',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})

TextArea.displayName = 'TextArea'
