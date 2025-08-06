import { create } from 'zustand'
import { type PreOrder } from '@/lib/definitions'

type PreOrderStore = Pick<PreOrder, 'id' | 'gender' | 'height' | 'weight' | 'frontImage' | 'sideImage' | 'measurementData'> & {
  setId: (id: PreOrder['id']) => void
  setGender: (gender: PreOrder['gender']) => void
  setHeight: (height: PreOrder['height']) => void
  setWeight: (weight: PreOrder['weight']) => void
  setFrontImage: (img: PreOrder['frontImage']) => void
  setSideImage: (img: PreOrder['sideImage']) => void
  setMeasurements: (measurementData: PreOrder['measurementData']) => void
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
  setId: (id) => set({ id }),
  setGender: (gender) => set({ gender }),
  setHeight: (height) => set({ height }),
  setWeight: (weight) => set({ weight }),
  setFrontImage: (frontImage) => set({ frontImage }),
  setSideImage: (sideImage) => set({ sideImage }),
  setMeasurements: ((measurementData) => set({ measurementData })),
  clearImages: () => set({ frontImage: null, sideImage: null }),
  clearStore: () => set({ gender: null, height: null, weight: null, frontImage: null, sideImage: null, measurementData: undefined }),
}))
