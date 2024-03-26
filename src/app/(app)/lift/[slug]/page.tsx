'use client'

import { useHotkeys } from 'react-hotkeys-hook'

import { IntervalSwitcher } from '~/components/lifts/interval-switcher'
import { LiftActions } from '~/components/lifts/lift-actions'
import { LiftDataTable, LiftProgressChart } from '~/components/lifts/lift-progress-chart'
import { SetForm } from '~/components/sets/set-form'
import { Button } from '~/components/shared/button'
import { Spinner } from '~/components/shared/spinner'
import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'

type LiftPageParams = {
  params: {
    slug: string
  }
}

export default function LiftPage({ params }: LiftPageParams) {
  const lift = api.lifts.getBySlug.useQuery({ slug: params.slug })
  const { handleDialog } = useDialogStore()

  useHotkeys('s', () => {
    handleDialog({ component: <SetForm lift={lift.data} />, title: 'Add set' })
  })

  if (lift.isLoading) return <Spinner />
  if (!lift.data) return null

  return (
    <>
      <div className='flex items-center justify-between pb-4'>
        <div>
          <h1 className='text-xl'>{lift.data.name}</h1>
        </div>
        <div className='flex items-center gap-2'>
          <IntervalSwitcher />

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

      <div className='space-y-4'>
        <LiftDataTable lift={lift.data} />
        <LiftProgressChart lift={lift.data} />
      </div>
    </>
  )
}
