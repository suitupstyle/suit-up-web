import { create } from 'zustand'
import { type PreOrder } from '../lib/definitions'
import { logger } from '../lib/logger'

type PreOrderStore = PreOrder & {
  setId: (id: PreOrder['id']) => void
  setGender: (gender: PreOrder['gender']) => void
  setHeight: (height: PreOrder['height']) => void
  setWeight: (weight: PreOrder['weight']) => void
  setFrontImage: (img: PreOrder['frontImage']) => void
  setSideImage: (img: PreOrder['sideImage']) => void
  clearImages: () => void
  clearStore: () => void
}

export const usePreOrderStore = create<PreOrderStore>((set) => ({
  id: null,
  gender: null,
  height: null,
  weight: null,
  frontImage: null,
  sideImage: null,
  setId: (id) => {
    logger.log('set id', { id })
    return set({ id })
  },
  setGender: (gender) => set({ gender }),
  setHeight: (height) => set({ height }),
  setWeight: (weight) => set({ weight }),
  setFrontImage: (frontImage) => set({ frontImage }),
  setSideImage: (sideImage) => set({ sideImage }),
  clearImages: () => set({ frontImage: null, sideImage: null }),
  clearStore: () => set({ id: null, gender: null, height: null, weight: null, frontImage: null, sideImage: null }),
}))
