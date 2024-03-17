import { create } from 'zustand'

export const intervals = [
  { label: 'D', days: 0 },
  { label: '7D', days: 6 },
  { label: '15D', days: 14 },
  { label: '30D', days: 29 }
] as const

type DateInterval = (typeof intervals)[number]

interface DateIntervalState {
  interval: DateInterval
  setInterval: (interval: string) => void
}

export const useDateIntervalStore = create<DateIntervalState>((set) => ({
  interval: {
    label: 'D',
    days: 0
  },
  setInterval: (interval) => set({ interval: intervals.find((i) => i.label === interval) })
}))
