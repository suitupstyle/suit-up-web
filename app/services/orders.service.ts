import { fetchClient } from '@/app/lib/api/client'
import type {
  CreateOrderDTO,
  CreateOrderApiResponse,
  CreateCheckoutSessionDTO,
  CreateCheckoutSessionApiResponse,
} from '@/app/lib/definitions'

export const OrdersService = {
  createOrder: async (data: CreateOrderDTO): Promise<CreateOrderApiResponse> => {
    return fetchClient('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  createCheckoutSession: async (
    data: CreateCheckoutSessionDTO,
  ): Promise<CreateCheckoutSessionApiResponse> => {
    return fetchClient('/payments/create-checkout-session', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
