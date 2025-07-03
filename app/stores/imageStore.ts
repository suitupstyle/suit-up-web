import { create } from 'zustand'

type ImageStore = {
  frontImage: string | null
  sideImage: string | null
  setFrontImage: (img: string | null) => void
  setSideImage: (img: string | null) => void
  clearImages: () => void
}

export const useImageStore = create<ImageStore>((set) => ({
  frontImage: null,
  sideImage: null,
  setFrontImage: (frontImage) => set({ frontImage }),
  setSideImage: (sideImage) => set({ sideImage }),
  clearImages: () => set({ frontImage: null, sideImage: null })
}))