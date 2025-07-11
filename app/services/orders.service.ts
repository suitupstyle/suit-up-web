import { fetchClient, fetchMock, mutateMockMeasurements } from '../lib/api/client';
import { type Measurements, type PreOrderPayload } from '../lib/definitions';
import { UploadSchema } from '../lib/schemas';


export const OrdersService = {
  createOrder: async (orderData: PreOrderPayload) => {
    return fetchMock('createOrderResponse') // TODO: comment once endpoint is finished

    return fetchClient('/preorders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },
  uploadImages: async (images: { orderId: string, frontImage: string; sideImage: string }) => {
    const validated = UploadSchema.parse({
      frontImage: {
        data: images.frontImage,
        type: 'image/jpeg', // TODO: Extraer del Base64
        size: Math.floor(images.frontImage.length * 0.75), // Estimation
      },
      sideImage: {
        data: images.sideImage,
        type: 'image/jpeg',
        size: Math.floor(images.sideImage.length * 0.75),
      },
    });

    const formData = new FormData();
    formData.append('front', validated.frontImage.data);
    formData.append('side', validated.sideImage.data);

    return fetchMock('uploadImagesResponse')  // TODO: comment once endpoint is finished

    return fetchClient(`/preorders/${images.orderId}/measure`, {
      method: 'POST',
      body: formData,
    })
  },
  getMeasurements: async () => {
    return fetchMock('measurements') // TODO: comment once endpoint is finished
  },
  updateMeasurements: async (data: Measurements) => {
    return mutateMockMeasurements(data) // TODO: comment once endpoint is finished
  },
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