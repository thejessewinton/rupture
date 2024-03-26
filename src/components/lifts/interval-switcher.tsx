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
      className='relative flex w-fit shrink-0 gap-1 rounded border border-neutral-200 text-xs dark:border-neutral-800'
    >
      {intervals.map((interval) => (
        <ToggleGroup.Item
          key={interval.label}
          value={interval.label}
          className='h-8 rounded px-3 outline-none transition-all hover:bg-neutral-200 focus:bg-neutral-200 radix-state-on:bg-neutral-200 hover:dark:bg-neutral-800 focus:dark:bg-neutral-800 radix-state-on:dark:bg-neutral-800'
        >
          {interval.label}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  )
}
