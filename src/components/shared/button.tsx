import { type ComponentPropsWithRef, type ReactNode } from 'react'

import Link, { type LinkProps } from 'next/link'

import { classNames } from '~/utils/core'

type ButtonProps =
  | ({ href?: never; icon?: ReactNode; disabled?: boolean } & ComponentPropsWithRef<'button'>)
  | ({ href: string; icon?: ReactNode; disabled?: boolean } & ComponentPropsWithRef<'a'> & LinkProps<string>)

export const Button = ({ children, icon, className, disabled, ...props }: ButtonProps) => {
  if (props.href === undefined) {
    return (
      <button
        className={classNames(
          'flex h-fit w-fit cursor-pointer items-center justify-center gap-3 rounded bg-neutral-900 px-8 py-1.5 text-xs font-medium text-white shadow-sm shadow-black/25 outline-none transition-all focus:ring-1 focus:ring-sky-600/75 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-neutral-900',
          className
        )}
        disabled={disabled}
        {...props}
      >
        {icon ? icon : null}
        {children}
      </button>
    )
  }

  return (
    <Link
      className={classNames(
        'flex h-fit w-fit cursor-pointer items-center justify-center gap-3 rounded bg-neutral-900 px-8 py-1.5 text-xs font-medium text-white shadow-sm shadow-black/25 outline-none transition-all focus:ring-1 focus:ring-sky-600/75 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-white dark:text-neutral-900',
        className
      )}
      {...props}
    >
      {icon ? icon : null}
      {children}
    </Link>
  )
}
