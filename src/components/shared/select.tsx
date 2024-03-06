import { type ComponentPropsWithRef, Ref } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'

type SelectProps = ComponentPropsWithRef<typeof SelectPrimitive.Root>

export const Select = ({ children, ...props }: SelectProps) => {
  return (
    <SelectPrimitive.Root {...props}>
      <SelectPrimitive.Trigger>Open</SelectPrimitive.Trigger>
      <SelectPrimitive.Content>
        <SelectPrimitive.Item value='kgs'>KG</SelectPrimitive.Item>
        <SelectPrimitive.Item value='lbs'>LB</SelectPrimitive.Item>
      </SelectPrimitive.Content>
    </SelectPrimitive.Root>
  )
}
