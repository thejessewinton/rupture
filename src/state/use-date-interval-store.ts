import { create } from 'zustand'

export const intervals = [
  { label: '7D', days: 7 },
  { label: '15D', days: 15 },
  { label: '30D', days: 30 }
] as const

type DateInterval = (typeof intervals)[number]

interface DateIntervalState {
  interval: DateInterval
  setInterval: (interval: string) => void
}

export const useDateIntervalStore = create<DateIntervalState>((set) => ({
  interval: {
    label: '7D',
    days: 7
  },
  setInterval: (interval) => set({ interval: intervals.find((i) => i.label === interval) })
}))
