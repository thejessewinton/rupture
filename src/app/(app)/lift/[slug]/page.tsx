'use client'

import { LiftProgressChart } from '~/components/lifts/lift-progress-chart'
import { NewSetAction } from '~/components/sets/set-form'
import { api } from '~/trpc/react'
import { estimatedMax } from '~/utils/core'

type LiftPageParams = {
  params: {
    slug: string
  }
}

export default function LiftPage({ params }: LiftPageParams) {
  const lift = api.lifts.getBySlug.useQuery({ slug: params.slug })

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
        <NewSetAction lift={lift.data} />
      </div>

      <LiftProgressChart lift={lift.data} />
    </>
  )
}
