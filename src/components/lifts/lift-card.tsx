import { api } from '~/trpc/react'
import { RouterOutputs } from '~/trpc/shared'
import { Dropdown } from '~/components/shared/dropdown'
import SvgEllipsis from '~/components/svg/ellipsis'
import { LiftForm } from '~/components/lifts/lift-form'
import { DeleteConfirm } from '~/components/actions/delete-confirm'
import { useDialogStore } from '~/state/use-dialog-store'
import Link from 'next/link'
import useMeasure from 'react-use-measure'

type LiftCardProps = {
  lift: RouterOutputs['lifts']['getAll'][number]
}

export const LiftCard = ({ lift }: LiftCardProps) => {
  const [ref, bounds] = useMeasure()
  return (
    <Link
      href={`/lift/${lift.slug}`}
      ref={ref}
      className='rounded border border-neutral-200 p-4 dark:border-neutral-800'
    >
      <div className='flex justify-between'>{lift.name}</div>
    </Link>
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
        <button className='rounded-sm p-1 outline-none transition-all hover:bg-neutral-50 focus:ring-2 focus:ring-blue-400 hover:dark:bg-neutral-800'>
          <SvgEllipsis className='h-4 w-4' />
        </button>
      }
      align='end'
    >
      <Dropdown.Item>
        <button
          className='text-red-900 dark:text-red-500'
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
