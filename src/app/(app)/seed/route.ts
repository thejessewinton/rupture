import dayjs from 'dayjs'

import { db } from '~/server/db'
import { set } from '~/server/db/schema'
import { getDaysBetween } from '~/utils/date'

export const GET = async () => {
  const dates = getDaysBetween(dayjs().subtract(50, 'days'), dayjs())

  const randomNumberBetween = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1) + min)

  for (const date of dates) {
    await db.insert(set).values({
      user_id: '3d28b643-5bc4-4177-8dbf-43606886f87c',
      date: date.toDate(),
      reps: 5,
      weight: randomNumberBetween(110, 175),
      tracked: true,
      composition_id: 5,
      lift_id: 13,
      unit: 'lbs'
    })
  }

  return new Response('seeded')
}
