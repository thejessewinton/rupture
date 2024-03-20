import { type ComponentPropsWithRef } from 'react'

import { classNames } from '~/utils/core'

type TableProps = ComponentPropsWithRef<'table'>

export const Table = ({ children, className, ...props }: TableProps) => {
  return (
    <table {...props} className={classNames('w-full text-left text-xs', className)}>
      {children}
    </table>
  )
}

type TableHeadProps = ComponentPropsWithRef<'thead'>

export const TableHead = ({ children, ...props }: TableHeadProps) => {
  return (
    <thead {...props} className='text-xs text-neutral-500 dark:text-neutral-400'>
      {children}
    </thead>
  )
}

type TableHeaderProps = ComponentPropsWithRef<'th'>

export const TableHeader = ({ children, ...props }: TableHeaderProps) => {
  return (
    <th {...props} className='py-2'>
      {children}
    </th>
  )
}

type TableRowProps = ComponentPropsWithRef<'tr'>

export const TableRow = ({ children, ...props }: TableRowProps) => {
  return (
    <tr {...props} className='border-b border-neutral-200 dark:border-neutral-800'>
      {children}
    </tr>
  )
}

type TableCellProps = ComponentPropsWithRef<'td'>

export const TableCell = ({ children, ...props }: TableCellProps) => {
  return (
    <td {...props} className='py-2'>
      {children}
    </td>
  )
}

type TableBodyProps = ComponentPropsWithRef<'tbody'>

export const TableBody = ({ children, ...props }: TableBodyProps) => {
  return <tbody {...props}>{children}</tbody>
}
