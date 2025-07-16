import { create } from 'zustand'
import { type UUID } from '../lib/definitions'

type OrderStore = {
  id: UUID | null
  preorderId: UUID | null
  gender: string | null
  height: number | null
  weight: number | null
  frontImage: string | null
  sideImage: string | null
  setOrderId: (id: UUID) => void
  setPreorderId: (preorderId: UUID) => void
  setGender: (gender: string) => void
  setHeight: (height: number) => void
  setWeight: (weight: number) => void
  setFrontImage: (img: string | null) => void
  setSideImage: (img: string | null) => void
  clearImages: () => void
  clearStore: () => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  id: null,
  preorderId: null,
  gender: null,
  height: null,
  weight: null,
  frontImage: null,
  sideImage: null,
  setOrderId: (id) => set({ id }),
  setPreorderId: (preorderId) => set({ preorderId }),
  setGender: (gender) => set({gender}),
  setHeight: (height) => set({height}),
  setWeight: (weight) => set({weight}),
  setFrontImage: (frontImage) => set({ frontImage }),
  setSideImage: (sideImage) => set({ sideImage }),
  clearImages: () => set({ frontImage: null, sideImage: null }),
  clearStore: () => set({ id: null, gender: null, height: null, weight: null, frontImage: null, sideImage: null }),
}))
