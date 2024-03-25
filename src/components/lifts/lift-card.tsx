import Link from 'next/link'

import dayjs from 'dayjs'
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis } from 'recharts'
import { sortBy } from 'remeda'

import { type RouterOutputs } from '~/trpc/shared'
import { getDaysBetween } from '~/utils/date'

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
    <Link
      href={`/lift/${lift.slug}`}
      className='relative block rounded border border-neutral-200 px-6 py-2 dark:border-neutral-800'
    >
      <div className='grid grid-cols-12 items-end justify-end'>
        <ResponsiveContainer className='relative -z-10 col-span-7 h-full max-h-32 min-h-32'>
          <LineChart data={data} className='text-xs'>
            <Line dot={false} dataKey='weight' className='[&>path]:stroke-blue-800' />
          </LineChart>
        </ResponsiveContainer>
        <h2 className='col-span-5'>{lift.name}</h2>
      </div>
    </Link>
  )
}
