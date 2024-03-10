'use client'

import { api } from '~/trpc/react'
import { LiftActions } from '~/components/lifts/lifts-table'

export const WorkoutTable = () => {
  const workouts = api.workouts.getAll.useQuery()

  if (!workouts.data) return null

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
        {workouts.data.map((lift) => (
          <tr key={lift.id}>
            <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm'>
              <div className='flex items-center gap-1'>{lift.name}</div>
            </td>
            <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
              <div className='flex items-center gap-1'></div>
            </td>

            {lift.lifts.map((lift) => (
              <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
                <LiftActions lift={lift} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
