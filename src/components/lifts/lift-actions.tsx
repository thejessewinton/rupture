import { useRouter } from 'next/navigation'

import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { type RouterOutputs } from '~/trpc/shared'
import { getPercentagesOfMax } from '~/utils/core'
import { DeleteConfirm } from '../actions/delete-confirm'
import { Dropdown, DropdownItem } from '../shared/dropdown'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../shared/table'

type LiftActionsProps = { lift: RouterOutputs['lifts']['getAll'][number] }

export const LiftActions = ({ lift }: LiftActionsProps) => {
  const { handleDialog, setIsOpen } = useDialogStore()
  const router = useRouter()

  const utils = api.useUtils()

  const deleteLift = api.lifts.deleteLift.useMutation({
    onMutate: (data) => {
      setIsOpen(false)
      router.push('/')
      const previousLifts = utils.lifts.getAll.getData()

      if (previousLifts) {
        utils.lifts.getAll.setData(
          undefined,
          previousLifts.filter((lift) => data.id !== lift.id)
        )
      }
    }
  })

  return (
    <Dropdown
      trigger={
        <button className='flex h-8 w-8 justify-center rounded border border-neutral-200 p-1 outline-none transition-all hover:bg-neutral-50 focus:ring-2 focus:ring-blue-400 dark:border-neutral-800 dark:hover:bg-neutral-900'>
          <EllipsisHorizontalIcon className='h-4 w-4' />
        </button>
      }
      align='end'
    >
      <DropdownItem>
        <button
          onClick={() => {
            handleDialog({
              component: <LiftPercentagesTable currentMax={lift.personal_record} />,
              title: 'Lift percentages'
            })
          }}
        >
          View percentages
        </button>
      </DropdownItem>
      <DropdownItem>
        <button
          className='text-red-900 dark:text-red-500'
          onClick={() => {
            handleDialog({
              title: 'Delete lift',
              component: (
                <DeleteConfirm
                  title={`Are you sure you want to delete ${lift.name} and all sets?`}
                  onDelete={() => deleteLift.mutate({ id: lift.id })}
                />
              )
            })
          }}
        >
          Delete lift
        </button>
      </DropdownItem>
    </Dropdown>
  )
}

const LiftPercentagesTable = ({ currentMax }: { currentMax: number }) => {
  const percentages = getPercentagesOfMax(currentMax)
  return (
    <>
      <h2 className='mb-8 text-sm dark:text-neutral-500'>
        Below are calculated percentages of your lifts, based on your current 1RM.
      </h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>Percentage</TableHeader>
            <TableHeader>Weight</TableHeader>
          </TableRow>
        </TableHead>
        <TableBody>
          {percentages.map(({ percentage, value }) => (
            <TableRow key={percentage}>
              <TableCell>{percentage}</TableCell>
              <TableCell>{value}lbs.</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
