import { create } from 'zustand'
import { UUID } from '../lib/definitions'

type OrderStore = {
  id: UUID | null
  frontImage: string | null
  sideImage: string | null
  setOrderId: (id: UUID) => void
  setFrontImage: (img: string | null) => void
  setSideImage: (img: string | null) => void
  clearImages: () => void
  clearStore: () => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  id: null,
  frontImage: null,
  sideImage: null,
  setOrderId: (id) => set({ id }),
  setFrontImage: (frontImage) => set({ frontImage }),
  setSideImage: (sideImage) => set({ sideImage }),
  clearImages: () => set({ frontImage: null, sideImage: null }),
  clearStore: () => set({ id: null, frontImage: null, sideImage: null }),
}))