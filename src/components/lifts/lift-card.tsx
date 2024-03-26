import Link from 'next/link'

import { Line, LineChart, ResponsiveContainer } from 'recharts'
import { sortBy } from 'remeda'

import { type RouterOutputs } from '~/trpc/shared'
import dayjs, { getDaysBetween } from '~/utils/date'

type LiftCardProps = {
  lift: RouterOutputs['lifts']['getAll'][number]
}

export const LiftCard = ({ lift }: LiftCardProps) => {
  const dates = getDaysBetween(dayjs().subtract(30, 'days'), dayjs())

  const data = dates.map((date) => {
    const sets = lift.sets.filter((set) => dayjs(set.date).isSame(dayjs(date), 'day'))
    const [setWithHighestWeight] = sortBy(sets, [(s) => s.weight, 'desc'])

    if (!setWithHighestWeight) return { day: dayjs(date).format('MMM, DD'), weight: 0, estimatedMax: 0 }

    const { weight } = setWithHighestWeight

    return {
      day: dayjs(date).format('MMM, DD'),
      weight
    }
  })

  return (
    <Link href={`/lift/${lift.slug}`} className='relative rounded border border-neutral-200 dark:border-neutral-800'>
      <div className='mb-4 mt-8 max-h-24 min-h-24 w-full border-b border-neutral-800'>
        <ResponsiveContainer className='relative -z-10 min-h-16'>
          <LineChart defaultShowTooltip={false} data={data} className='w-full text-xs'>
            <Line type='monotone' dot={false} stroke='#93c5fd' fill='#222' dataKey='weight' />
          </LineChart>
        </ResponsiveContainer>
        <span className='block pr-4 text-right text-2xs text-neutral-500'>{lift.sets.length} sets</span>
      </div>

      <div className='px-6 pb-4'>
        <h2>{lift.name}</h2>
        <span className='text-2xs text-neutral-500'>Last updated {dayjs(lift.updated_at).fromNow()}</span>
      </div>
    </Link>
  )
}
