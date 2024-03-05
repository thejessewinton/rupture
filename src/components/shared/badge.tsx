import { type ReactNode, type ComponentPropsWithoutRef } from 'react'
import { cva, type VariantProps } from 'cva'
import { classNames } from '~/utils/core'

const badge = cva(
  'group text-2xs border self-start whitespace-nowrap p-1 inline-flex gap-2 justify-center items-center text-center leading-none no-underline rounded-full transition',
  {
    variants: {
      variant: {
        default: 'bg-green-500/25 border-green-500 text-green-500',
        warning: 'bg-orange-500/25 border-orange-500 text-orange-500',
        danger: 'bg-red-500/25 border-red-500 text-red-500'
      }
    },
    defaultVariants: {
      variant: 'default'
    }
  }
)

type BadgeProps = ComponentPropsWithoutRef<'span'> &
  VariantProps<typeof badge> & {
    icon?: ReactNode
  }

export const Badge = ({ children, variant, className, icon, ...props }: BadgeProps) => {
  return (
    <div className={classNames(badge({ variant, className }))} {...props}>
      {icon && <span>{icon}</span>}
      {children}
    </div>
  )
}
