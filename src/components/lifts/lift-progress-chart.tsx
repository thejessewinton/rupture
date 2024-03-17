'use client'

import dayjs from 'dayjs'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { sortBy } from 'remeda'

import { useDateIntervalStore } from '~/state/use-date-interval-store'
import { type RouterOutputs } from '~/trpc/shared'
import { getDaysBetween } from '~/utils/date'
import { IntervalSwitcher } from './interval-switcher'

type LiftProgressChartProps = {
  lift: NonNullable<RouterOutputs['lifts']['getBySlug']>
}

export const LiftProgressChart = ({ lift }: LiftProgressChartProps) => {
  const { interval } = useDateIntervalStore()

  const liftsByDate = sortBy([...lift.sets], [(s) => s.date, 'desc'])

  const dates = getDaysBetween(dayjs().subtract(interval.days, 'days'), dayjs())

  const data = dates.map((date) => {
    const sets = liftsByDate.filter((set) => dayjs(set.date).isSame(dayjs(date), 'day'))

    const weight = sets.reduce((acc, set) => acc + set.weight, 0)
    return {
      name: dayjs(date).format('MMM, DD'),
      weight
    }
  })

  return (
    <div className='h-full w-full'>
      <IntervalSwitcher />
      <ResponsiveContainer className='relative h-80 max-h-80 w-full'>
        <BarChart data={data} className='text-xs'>
          <XAxis dataKey='name' />
          <YAxis orientation='right' />
          <Tooltip />
          <Bar dataKey='weight' className='fill-blue-300' />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
