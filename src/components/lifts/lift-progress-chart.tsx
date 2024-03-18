'use client'

import dayjs from 'dayjs'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from 'recharts'
import { type NameType, type ValueType } from 'recharts/types/component/DefaultTooltipContent'
import { sortBy } from 'remeda'

import { IntervalSwitcher } from '~/components/lifts/interval-switcher'
import { useDateIntervalStore } from '~/state/use-date-interval-store'
import { type RouterOutputs } from '~/trpc/shared'
import { estimatedMax } from '~/utils/core'
import { getDaysBetween } from '~/utils/date'

type LiftProgressChartProps = {
  lift: NonNullable<RouterOutputs['lifts']['getBySlug']>
}

const CustomTooltip = ({ active }: TooltipProps<ValueType, NameType>) => {
  if (!active) return null

  return (
    <div className='rounded border border-neutral-200 bg-neutral-900 px-4 py-2 dark:border-neutral-800'>
      <p className='label'>Weight</p>
    </div>
  )
}

export const LiftProgressChart = ({ lift }: LiftProgressChartProps) => {
  const { interval } = useDateIntervalStore()

  const liftsByDate = sortBy([...lift.sets], [(s) => s.date, 'desc'])

  const dates = getDaysBetween(dayjs().subtract(interval.days, 'days'), dayjs())

  const data = dates.map((date) => {
    const sets = liftsByDate.filter((set) => dayjs(set.date).isSame(dayjs(date), 'day'))
    const [setWithHighestWeight] = sortBy(sets, [(s) => s.weight, 'desc'])

    if (!setWithHighestWeight) return { day: dayjs(date).format('MMM, DD'), weight: 0, estimatedMax: 0 }

    const { weight } = setWithHighestWeight

    return {
      day: dayjs(date).format('MMM, DD'),
      weight,
      estimatedMax: estimatedMax({ weight, reps: 5 })
    }
  })

  return (
    <div className='relative w-full rounded-md border border-neutral-200 p-8 dark:border-neutral-800'>
      <div className='absolute right-0 top-0 h-[1px] w-80 bg-gradient-to-r from-transparent via-neutral-700 to-transparent' />
      <div className='mb-20 flex justify-between'>
        <div>
          <h2 className='text-neutral-800 dark:text-neutral-500'>Total sets</h2>
          <span className='text-4xl text-white'>{lift.sets.length}</span>
        </div>
        <div>
          <IntervalSwitcher />
        </div>
      </div>
      <ResponsiveContainer className='relative h-full min-h-80'>
        <BarChart data={data} className='text-xs'>
          <XAxis tickLine={false} dataKey='day' />
          <YAxis tickLine={false} dataKey='weight' orientation='right' />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar barSize={4} dataKey='weight' className='fill-slate-500' width={4} />
          <Bar barSize={4} dataKey='estimatedMax' className='fill-green-700' width={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
