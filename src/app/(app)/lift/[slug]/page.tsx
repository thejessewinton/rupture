'use client'

import { DeleteConfirm } from '~/components/actions/delete-confirm'
import { LiftProgressChart } from '~/components/lifts/lift-progress-chart'
import { NewSetAction } from '~/components/sets/set-form'
import { Dropdown, Item } from '~/components/shared/dropdown'
import { Spinner } from '~/components/shared/spinner'
import SvgEllipsis from '~/components/svg/ellipsis'
import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { type RouterOutputs } from '~/trpc/shared'
import { estimatedMax } from '~/utils/core'

type LiftPageParams = {
  params: {
    slug: string
  }
}

export default function LiftPage({ params }: LiftPageParams) {
  const lift = api.lifts.getBySlug.useQuery({ slug: params.slug })

  if (lift.isLoading) return <Spinner />
  if (!lift.data) return null

  const [latestSet] = lift.data.sets

  return (
    <>
      <div className='flex items-center justify-between pb-4'>
        <div>
          <h1 className='text-xl'>{lift.data.name}</h1>
          <span className='text-xs text-neutral-200 dark:text-neutral-500'>
            Current 1RM:{' '}
            {estimatedMax({
              weight: latestSet?.weight ?? 0,
              reps: latestSet?.reps ?? 0
            })}
          </span>
        </div>
        <div className='flex items-center gap-2'>
          <NewSetAction lift={lift.data} />
          <LiftActions lift={lift.data} />
        </div>
      </div>

      <LiftProgressChart lift={lift.data} />
    </>
  )
}

type LiftActionsProps = { lift: RouterOutputs['lifts']['getAll'][number] }

const LiftActions = ({ lift }: LiftActionsProps) => {
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
        <button className='flex h-8 w-8 justify-center rounded border border-neutral-800 p-1 outline-none transition-all hover:bg-neutral-50 focus:ring-2 focus:ring-blue-400 dark:hover:bg-neutral-900'>
          <SvgEllipsis className='h-4 w-4' />
        </button>
      }
      align='end'
    >
      <Item>
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
      </Item>
    </Dropdown>
  )
}
