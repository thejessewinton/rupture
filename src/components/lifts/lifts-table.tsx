'use client'

import { api } from '~/trpc/react'
import { RouterOutputs } from '~/trpc/shared'
import { Button } from '~/components/shared/button'
import { Dropdown } from '~/components/shared/dropdown'
import SvgEllipsis from '~/components/svg/ellipsis'

import { useDialogStore } from '~/state/use-dialog-store'
import { useRouter } from 'next/navigation'
import { DeleteConfirm } from '~/components/actions/delete-confirm'
import { calculateWeight } from '~/utils/core'
import { EditLiftForm, LiftForm } from './lift-form'
import { ReactNode } from 'react'
import { EmptyState } from '../actions/empty-state'

export const LiftsTable = () => {
  const lifts = api.lifts.getAll.useQuery()

  if (!lifts.data) return null

  const tableHeadings = ['Name', 'PR']

  return (
    <table className='min-w-full border-separate border-spacing-0 border-none text-left'>
      <thead className='h-8 rounded-md bg-neutral-50 dark:bg-neutral-800'>
        <tr>
          {tableHeadings.map((heading) => (
            <th
              className='h-8 w-[500px] border-b border-t border-neutral-200 px-3 text-xs text-neutral-800 first:rounded-l-md first:border-l last:rounded-r-md last:border-r dark:border-neutral-600 dark:text-neutral-300'
              key={heading}
            >
              {heading}
            </th>
          ))}

          <th className='h-8 w-[70px] border-b border-t border-neutral-200 px-3 text-xs text-neutral-300 first:rounded-l-md first:border-l last:rounded-r-md last:border-r dark:border-neutral-600' />
        </tr>
      </thead>
      <tbody>
        {lifts.data.map((lift) => (
          <tr key={lift.id}>
            <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
              <div className='flex items-center gap-1'>{lift.name}</div>
            </td>
            <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
              <div className='flex items-center gap-1'>
                {calculateWeight({
                  weight: lift.personal_record,
                  unit: lift.unit,
                  convertTo: lift.unit
                })}{' '}
                {lift.unit}.
              </div>
            </td>

            <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
              <LiftActions lift={lift} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

type LiftActionsProps = { lift: RouterOutputs['lifts']['getAll'][number] }

export const LiftActions = ({ lift }: LiftActionsProps) => {
  const { handleDialog, handleDialogClose } = useDialogStore()

  const utils = api.useUtils()

  const deleteLift = api.lifts.deleteLift.useMutation({
    onMutate: (data) => {
      handleDialogClose()
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
        <button className='mx-auto rounded-sm p-1 outline-none transition-all hover:bg-neutral-50 focus:ring-2 focus:ring-blue-400 hover:dark:bg-neutral-800'>
          <SvgEllipsis className='h-4 w-4' />
        </button>
      }
      align='end'
    >
      <Dropdown.Item>
        <button
          onClick={() => {
            handleDialog({
              title: 'Update PR',
              component: <EditLiftForm lift={lift} />
            })
          }}
        >
          Update PR
        </button>
      </Dropdown.Item>
      <Dropdown.Item>
        <button
          onClick={() => {
            handleDialog({
              title: 'Delete lift',
              component: (
                <DeleteConfirm
                  title={`Are you sure you want to delete ${lift.name}?`}
                  onDelete={() => deleteLift.mutate({ id: lift.id })}
                />
              )
            })
          }}
        >
          Delete lift
        </button>
      </Dropdown.Item>
    </Dropdown>
  )
}

export const NewLiftAction = () => {
  const { handleDialog } = useDialogStore()
  return (
    <Button
      onClick={() => {
        handleDialog({
          title: 'Add lift',
          component: <LiftForm />
        })
      }}
    >
      Add lift
    </Button>
  )
}
