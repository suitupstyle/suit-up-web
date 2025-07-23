import { fetchClient, fetchMock, mutateMockMeasurements } from '../lib/api/client';
import { type PreOrder, type Measurements, type PreOrderPayload } from '../lib/definitions';
import { logger } from '../lib/logger';
import { UploadSchema } from '../lib/schemas';


export const OrdersService = {
  createPreorder: async (orderData: PreOrderPayload) => {
    return fetchClient('/preorders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  uploadImagesAndData: async (preorder: PreOrder) => {
    logger.log('preorder', preorder)
    const { id, frontImage, sideImage, gender, weight, height } = preorder
    const validated = UploadSchema.parse({
      frontImage: {
        data: frontImage,
        type: 'image/jpeg', // TODO: Extraer del Base64
        size: Math.floor((frontImage as string).length * 0.75), // Estimation
      },
      sideImage: {
        data: sideImage,
        type: 'image/jpeg',
        size: Math.floor((sideImage as string).length * 0.75),
      },
    });

    const formData = new FormData();
    formData.append('frontImage', validated.frontImage.data);
    formData.append('sideImage', validated.sideImage.data);
    formData.append('gender', (gender as string));
    formData.append('weight', (weight as number).toString());
    formData.append('height', (height as number).toString());


    return fetchMock('uploadImagesResponse')  // TODO: comment once endpoint is finished

    return fetchClient(`/preorders/${id}/measure`, {
      method: 'POST',
      //body: formData,
      body: JSON.stringify({
        frontImage,
        sideImage,
        gender,
        weight: Number(weight),
        height: Number(height),
      }),
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
