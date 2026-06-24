import { fetchMock } from '@/app/lib/api/client';


export const OrdersService = {
  getOrderCost: async () => {
    return fetchMock('orderCost') // TODO: comment once endpoint is finished
  },
  postPayment: async (data: any) => {
    return fetchMock('paymentResponse') // TODO: comment once endpoint is finished
  },
  getPaymentConfirmation: async (data: any) => {
    return fetchMock('paymentConfirmation') // TODO: comment once endpoint is finished
  },
};
