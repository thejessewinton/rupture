'use client'

import { api } from '~/trpc/react'
import { getPercentage } from '~/utils/core'
import { groupBy } from 'remeda'
import { Button } from '../shared/button'

export const WorkoutTable = ({ id }: { id: string }) => {
  const workout = api.workouts.getById.useQuery({ id })

  if (!workout.data) return null

  const exercisesByDay = groupBy(workout.data.exercises, (exercise) => exercise.day)

  const tableHeadings = ['Lift', 'Sets', 'Reps', 'Weight']

  return (
    <div className='space-y-8'>
      {Object.entries(exercisesByDay).map(([day, exercises]) => (
        <div>
          <div className='flex items-center justify-between pb-4'>
            <h1 className='text-xl'>{day}</h1>
          </div>
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
              {exercises.map((exercise) => (
                <tr key={exercise.id}>
                  <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm'>
                    <div className='flex items-center gap-1'>{exercise.lift?.name}</div>
                  </td>
                  <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
                    <div className='flex items-center gap-1'>{exercise.sets}</div>
                  </td>
                  <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
                    <div className='flex items-center gap-1'>{exercise.reps}</div>
                  </td>
                  <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
                    <div className='flex items-center gap-1'>
                      {getPercentage({ weight: exercise.lift!.personal_record, percentage: exercise.percentage })}
                    </div>
                  </td>
                  <td className='h-10 truncate border-b border-neutral-200 px-3 py-3 text-sm dark:border-neutral-600'>
                    <div className='flex items-center gap-1'></div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  )
}
