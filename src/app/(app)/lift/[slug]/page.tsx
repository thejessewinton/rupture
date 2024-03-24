'use client'

import { useRouter } from 'next/navigation'

import * as Tooltip from '@radix-ui/react-tooltip'

import { DeleteConfirm } from '~/components/actions/delete-confirm'
import { LiftProgressChart } from '~/components/lifts/lift-progress-chart'
import { SetForm } from '~/components/sets/set-form'
import { Button } from '~/components/shared/button'
import { Dropdown, DropdownItem } from '~/components/shared/dropdown'
import { Spinner } from '~/components/shared/spinner'
import SvgEllipsis from '~/components/svg/ellipsis'
import SvgInformation from '~/components/svg/information'
import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { type RouterOutputs } from '~/trpc/shared'
import { getEstimatedMax, getLiftPercentageOfBodyWeight } from '~/utils/core'

type LiftPageParams = {
  params: {
    slug: string
  }
}

export default function LiftPage({ params }: LiftPageParams) {
  const lift = api.lifts.getBySlug.useQuery({ slug: params.slug })
  const { handleDialog } = useDialogStore()

  if (lift.isLoading) return <Spinner />
  if (!lift.data) return null

  const [latestSet] = lift.data.sets

  const currentMax = getEstimatedMax({
    weight: latestSet?.weight ?? 0,
    reps: latestSet?.reps ?? 0
  })

  const currentPercentageofBodyWeight = getLiftPercentageOfBodyWeight({
    lift: currentMax,
    weight: lift.data.compositions?.weight ?? 0
  })

  return (
    <>
      <div className='flex items-center justify-between pb-4'>
        <div>
          <h1 className='text-xl'>{lift.data.name}</h1>
          <div className='flex items-center gap-3 text-xs text-neutral-800 dark:text-neutral-200'>
            Current 1RM: {currentMax} lbs.
            <span>{currentPercentageofBodyWeight}% of body weight</span>
            <Tooltip.Provider>
              <Tooltip.Root delayDuration={100}>
                <Tooltip.Trigger>
                  <SvgInformation className='h-4 w-4' />
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    sideOffset={5}
                    side='bottom'
                    align='center'
                    className='radix-state-closed:animate-scale-out-content radix-state-delayed-open:animate-scale-in-content'
                  >
                    <Tooltip.Arrow className='fill-neutral-100 dark:fill-neutral-800' />
                    <div className='rounded bg-neutral-100 p-2 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200'>
                      <p className='text-xs'>
                        Based on your latest set of {latestSet?.weight}x{latestSet?.reps}
                      </p>
                    </div>
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => {
              handleDialog({ component: <SetForm lift={lift.data} />, title: 'Add lift' })
            }}
          >
            Add set
          </Button>

          <LiftActions lift={lift.data} />
        </div>
      </div>

      <LiftProgressChart lift={lift.data} />
    </>
  )
}

type LiftActionsProps = { lift: RouterOutputs['lifts']['getAll'][number] }

const LiftActions = ({ lift }: LiftActionsProps) => {
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
          <SvgEllipsis className='h-4 w-4' />
        </button>
      }
      align='end'
    >
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
