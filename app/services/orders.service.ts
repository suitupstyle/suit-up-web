import { fetchClient } from '@/app/lib/api/client'
import type {
  CreateOrderDTO,
  CreateOrderApiResponse,
  CreatePaymentIntentDTO,
  CreatePaymentIntentApiResponse,
} from '@/app/lib/definitions'

export const OrdersService = {
  createOrder: async (data: CreateOrderDTO): Promise<CreateOrderApiResponse> => {
    return fetchClient('/orders', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  createPaymentIntent: async (
    data: CreatePaymentIntentDTO,
  ): Promise<CreatePaymentIntentApiResponse> => {
    return fetchClient('/payments/create-payment-intent', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },
}
