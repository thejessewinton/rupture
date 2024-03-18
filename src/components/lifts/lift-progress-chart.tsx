'use client'

import dayjs from 'dayjs'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, type TooltipProps } from 'recharts'
import { type NameType, type ValueType } from 'recharts/types/component/DefaultTooltipContent'

import { IntervalSwitcher } from '~/components/lifts/interval-switcher'
import { useDateIntervalStore } from '~/state/use-date-interval-store'
import { type RouterOutputs } from '~/trpc/shared'
import { estimatedMax } from '~/utils/core'
import { getDaysBetween } from '~/utils/date'

type LiftProgressChartProps = {
  lift: NonNullable<RouterOutputs['lifts']['getBySlug']>
}

export const LiftProgressChart = ({ lift }: LiftProgressChartProps) => {
  const { interval } = useDateIntervalStore()

  const dates = getDaysBetween(dayjs().subtract(interval.days, 'days'), dayjs())

  const data = dates.map((date) => {
    const sets = lift.sets.filter((set) => dayjs(set.date).isSame(dayjs(date), 'day') && set.tracked)
    const [latestSet] = sets

    if (!latestSet) return { day: dayjs(date).format('MMM, DD'), weight: undefined, estimatedMax: undefined }

    const { weight, reps } = latestSet

    return {
      day: dayjs(date).format('MMM, DD'),
      weight,
      estimatedMax: estimatedMax({ weight, reps })
    }
  })

  return (
    <div className='relative w-full rounded-md border border-neutral-200 p-8 dark:border-neutral-800'>
      <div className='absolute right-0 top-0 h-[1px] w-80 bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700' />
      <div className='mb-20 flex justify-between'>
        <div>
          <h2 className='text-neutral-800 dark:text-neutral-500'>Total sets</h2>
          <span className='text-4xl dark:text-white'>{lift.sets.length}</span>
        </div>
        <div>
          <IntervalSwitcher />
        </div>
      </div>
      <ResponsiveContainer className='relative h-full min-h-80'>
        <BarChart data={data} className='text-xs'>
          <XAxis tickLine={false} dataKey='day' />
          <YAxis tickLine={false} orientation='right' />
          <Tooltip cursor={false} content={<CustomTooltip />} />
          <Bar barSize={4} dataKey='weight' className='fill-slate-500' width={4} />
          <Bar barSize={4} dataKey='estimatedMax' className='fill-green-700' width={4} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  payload?: Array<{ name: string; value: number }>
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (!active) return null

  return (
    <div className='flex flex-col gap-1 rounded border border-neutral-200 bg-white px-4 py-2 dark:border-neutral-800 dark:bg-neutral-900'>
      {payload?.map((p) => (
        <div key={p.name}>
          {p.name === 'estimatedMax' ? 'Estimated max' : 'Weight'}: {p.value}
        </div>
      ))}
    </div>
  )
}
