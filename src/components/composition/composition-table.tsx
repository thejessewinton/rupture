import dayjs from 'dayjs'

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/shared/table'
import { type RouterOutputs } from '~/trpc/shared'

export const CompositionTable = ({
  compositions
}: {
  compositions: NonNullable<RouterOutputs['user']['getCurrent']>['compositions']
}) => {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Weight</TableHeader>
          <TableHeader>Body fat</TableHeader>
          <TableHeader>Date</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {compositions.map((composition) => (
          <TableRow key={composition.id}>
            <TableCell>
              {composition.weight} {composition.unit}.
            </TableCell>
            <TableCell>{composition.body_fat_percentage}</TableCell>
            <TableCell>{dayjs(composition.created_at).format('MM/DD/YY')}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
