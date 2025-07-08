import { fetchClient } from '../lib/api/client';
import { type PreOrderPayload } from '../lib/definitions';

export const OrdersService = {
  createOrder: async (orderData: PreOrderPayload) => {
    return fetchClient('/preorders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
};