import { create } from 'zustand'
import { type Item } from '@/app/lib/definitions'

type OrderStore = {
  orderId: number | null
  orderPrice: number | null
  orderItems: Item[] | null
  setOrder: (orderId: number, orderPrice: number, orderItems: Item[]) => void
  clearOrder: () => void
}

export const useOrderStore = create<OrderStore>((set) => ({
  orderId: null,
  orderPrice: null,
  orderItems: null,
  setOrder: (orderId, orderPrice, orderItems) =>
    set({ orderId, orderPrice, orderItems }),
  clearOrder: () => set({ orderId: null, orderPrice: null, orderItems: null }),
}))
