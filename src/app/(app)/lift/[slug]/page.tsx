'use client'

import dayjs from 'dayjs'
import { sortBy } from 'remeda'

import { LiftProgressChart } from '~/components/lifts/lift-progress-chart'
import { SetActions } from '~/components/sets/set-actions'
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
      <div className='grid gap-2'>
        <div className='min-h-60 overflow-hidden rounded-sm'>
          <LiftProgressChart lift={lift.data} />
        </div>
        <div className='col-span-4 rounded-md bg-neutral-900 px-4 py-6'>
          <h2 className='text-md text-neutral-500 dark:text-neutral-200'>Recent sets</h2>
          <div className='divide-y divide-neutral-200 dark:divide-neutral-600'>
            {sortBy(lift.data.sets, [(set) => set.date, 'desc'])
              .slice(0, 5)
              .map((set) => (
                <div key={set.id} className='flex justify-between px-1 py-4 text-sm'>
                  <div className='font-mono tracking-tighter'>
                    <span>
                      {set.weight} {set.unit}
                    </span>
                    <span className=' block text-xs text-neutral-500'>{dayjs(set.date).format('MMM DD, YYYY')}</span>
                  </div>

                  <div>
                    <SetActions set={set} />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  )
}
