'use client'

import * as ToggleGroup from '@radix-ui/react-toggle-group'

import { intervals, useDateIntervalStore } from '~/state/use-date-interval-store'

export const IntervalSwitcher = () => {
  const { setInterval } = useDateIntervalStore()

  return (
    <ToggleGroup.Root
      type='single'
      defaultValue={intervals[0].label}
      onValueChange={(e) => setInterval(e)}
      className='flex gap-2'
    >
      {intervals.map((interval) => (
        <ToggleGroup.Item key={interval.label} value={interval.label}>
          {interval.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
