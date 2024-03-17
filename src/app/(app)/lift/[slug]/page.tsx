'use client'

import { format } from 'date-fns'
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

  if (!lift.data || !lift.data) return

  const tableHeadings = ['Date', 'Weight', 'Reps', 'Estimated Max']
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
          {sortBy(lift.data.sets, [(set) => set.date, 'desc']).map((set) => (
            <tr key={set.id}>
              <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
                <div className='flex items-center gap-1'>{format(set.date, 'MMMM dd, yyyy')}</div>
              </td>
              <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
                <div className='flex items-center gap-1'>
                  {' '}
                  {set.weight}
                  {set.unit}.
                </div>
              </td>
              <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
                <div className='flex items-center gap-1'>{set.reps}</div>
              </td>

              <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
                <div className='flex items-center gap-1'>
                  {estimatedMax({
                    weight: set.weight,
                    reps: set.reps
                  })}
                </div>
              </td>

              <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
                <SetActions set={set} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
