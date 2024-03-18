import Link from 'next/link'

import dayjs from 'dayjs'
import { Bar, BarChart, ResponsiveContainer, XAxis } from 'recharts'
import { sortBy } from 'remeda'

import { DeleteConfirm } from '~/components/actions/delete-confirm'
import { Dropdown, Item } from '~/components/shared/dropdown'
import SvgEllipsis from '~/components/svg/ellipsis'
import { useDialogStore } from '~/state/use-dialog-store'
import { api } from '~/trpc/react'
import { type RouterOutputs } from '~/trpc/shared'
import { getDaysBetween } from '~/utils/date'

type LiftCardProps = {
  lift: RouterOutputs['lifts']['getAll'][number]
}

export const LiftCard = ({ lift }: LiftCardProps) => {
  const liftsByDate = sortBy([...lift.sets], [(s) => s.date, 'desc'])

  const dates = getDaysBetween(dayjs().subtract(7, 'days'), dayjs())

  const data = dates.map((date) => {
    const sets = liftsByDate.filter((set) => dayjs(set.date).isSame(dayjs(date), 'day'))
    const [setWithHighestWeight] = sortBy(sets, [(s) => s.weight, 'desc'])

    if (!setWithHighestWeight) return { day: dayjs(date).format('MMM, DD'), weight: 0, estimatedMax: 0 }

    const { weight } = setWithHighestWeight

    return {
      day: dayjs(date).format('MMM, DD'),
      weight
    }
  })

  return (
    <div className='block rounded border border-neutral-200 p-8 dark:border-neutral-800'>
      <div className='mb-10 flex items-center justify-between'>
        <h2>{lift.name}</h2>

        <LiftActions lift={lift} />
      </div>
      <Link href={`/lift/${lift.slug}`}>
        <ResponsiveContainer className='relative -z-10 h-full max-h-40 min-h-40'>
          <BarChart data={data} className='text-xs'>
            <XAxis dataKey='day' tickLine={false} />
            <Bar barSize={4} dataKey='weight' className='fill-green-800' />
          </BarChart>
        </ResponsiveContainer>
      </Link>
    </div>
  )
}

type LiftActionsProps = { lift: RouterOutputs['lifts']['getAll'][number] }

export const LiftActions = ({ lift }: LiftActionsProps) => {
  const { handleDialog, handleDialogClose } = useDialogStore()

  const utils = api.useUtils()

  const deleteLift = api.lifts.deleteLift.useMutation({
    onMutate: (data) => {
      handleDialogClose()
      const previousLifts = utils.lifts.getAll.getData()

      if (previousLifts) {
        utils.lifts.getAll.setData(
          undefined,
          previousLifts.filter((lift) => data.id !== lift.id)
        )
      }
    }
  })

  return (
    <Dropdown
      trigger={
        <button className='rounded-sm p-1 outline-none transition-all hover:bg-neutral-50 focus:ring-2 focus:ring-blue-400 hover:dark:bg-neutral-800'>
          <SvgEllipsis className='h-4 w-4' />
        </button>
      }
      align='end'
    >
      <Item>
        <button
          className='text-red-900 dark:text-red-500'
          onClick={() => {
            handleDialog({
              title: 'Delete lift',
              component: (
                <DeleteConfirm
                  title={`Are you sure you want to delete ${lift.name}?`}
                  onDelete={() => deleteLift.mutate({ id: lift.id })}
                />
              )
            })
          }}
        >
          Delete lift
        </button>
      </Item>
    </Dropdown>
  )
}
