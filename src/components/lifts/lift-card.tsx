import Link from 'next/link'

import dayjs from 'dayjs'
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts'
import { sortBy } from 'remeda'

import { type RouterOutputs } from '~/trpc/shared'
import { getDaysBetween } from '~/utils/date'

type LiftCardProps = {
  lift: RouterOutputs['lifts']['getAll'][number]
}

export const LiftCard = ({ lift }: LiftCardProps) => {
  const dates = getDaysBetween(dayjs().subtract(7, 'days'), dayjs())

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
      className='relative block rounded border border-neutral-200 p-8 dark:border-neutral-800'
    >
      <div className='absolute right-0 top-0 h-[1px] w-80 bg-gradient-to-r from-transparent via-neutral-300 to-transparent dark:via-neutral-700' />
      <div className='mb-10'>
        <h2>{lift.name}</h2>
      </div>

      <ResponsiveContainer className='relative -z-10 h-full max-h-40 min-h-40'>
        <BarChart data={data} className='text-xs'>
          <XAxis dataKey='day' tickLine={false} />
          <Bar barSize={4} dataKey='weight' className='fill-green-800' />
        </BarChart>
      </ResponsiveContainer>
    </Link>
  )
}
