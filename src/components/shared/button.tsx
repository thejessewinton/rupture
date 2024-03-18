import { type ComponentPropsWithRef, type ReactNode } from 'react'
import Link, { type LinkProps } from 'next/link'

import { cva, type VariantProps } from 'cva'

import { classNames } from '~/utils/core'

const button = cva(
  'flex h-fit w-fit relative overflow-hidden cursor-pointer items-center justify-center gap-3 rounded px-6 py-2 text-xs bg-neutral-900 outline-none transition-all focus:ring-1 focus:ring-sky-600/75 disabled:cursor-not-allowed disabled:opacity-70',
  {
    variants: {
      variant: {
        default: 'dark:text-white text-neutral-900 border border-neutral-200 dark:border-neutral-800',
        danger: 'bg-red-500/25 text-red-500'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

type ButtonProps =
  | ({ href?: never; icon?: ReactNode; disabled?: boolean } & ComponentPropsWithRef<'button'>)
  | ({ href: string; icon?: ReactNode; disabled?: boolean } & ComponentPropsWithRef<'a'> & LinkProps<string>)

export const Button = ({
  children,
  icon,
  className,
  variant,
  disabled,
  ...props
}: ButtonProps & VariantProps<typeof button>) => {
  if (props.href === undefined) {
    return (
      <button className={classNames(button({ variant, className }))} disabled={disabled} {...props}>
        {icon ? icon : null}
        {children}
      </button>
    )
  }

  return (
    <Link className={classNames(button({ variant, className }))} {...props}>
      {icon ? icon : null}
      {children}
    </Link>
  )
}
