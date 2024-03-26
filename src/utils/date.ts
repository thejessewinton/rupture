import dayjs, { type Dayjs } from 'dayjs'
import relative from 'dayjs/plugin/relativeTime'

dayjs.extend(relative)

export default dayjs

export const getDaysBetween = (start: Dayjs, end: Dayjs) => {
  const range = []
  let current = start
  while (!current.isAfter(end)) {
    range.push(current)
    current = current.add(1, 'days')
  }
  return range
}
