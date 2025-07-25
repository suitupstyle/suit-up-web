import { fetchClient, fetchMock, mutateMockMeasurements } from '../lib/api/client';
import { type PreOrder, type PreOrderPayload, type PreOrderResponse, type MeasurementData } from '../lib/definitions';
import { logger } from '../lib/logger';
import { UploadSchema } from '../lib/schemas';


export const OrdersService = {
  postUserDetails: async (data: any) => {
    return fetchMock('detailsResponse') // TODO: comment once endpoint is finished
  },
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
