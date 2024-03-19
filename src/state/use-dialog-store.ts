import { type ReactNode } from 'react'

import { create } from 'zustand'

type DialogState = {
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  component: ReactNode
  title: string | null
  handleDialog: ({ component, title }: { component: ReactNode; title: string }) => void
  handleDialogClose: () => void
}

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  setIsOpen: (value) => set(() => ({ isOpen: value })),
  component: null,
  title: null,
  handleDialog: ({ component, title }) => set({ component, title, isOpen: true }),
  handleDialogClose: () => set({ isOpen: false })
}))
