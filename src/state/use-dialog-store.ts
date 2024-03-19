import { create } from 'zustand'

type DialogState = {
  isOpen: boolean
  setDialogOpen: (value: boolean) => void
}

export const useDialogStore = create<DialogState>((set) => ({
  isOpen: false,
  setDialogOpen: (value) => set(() => ({ isOpen: value }))
}))
