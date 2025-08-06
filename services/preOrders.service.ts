import { fetchClient } from '@/lib/api/client';
import { type PreOrder, type PreOrderPayload, type PreOrderResponse } from '@/lib/definitions';
import { logger } from '@/lib/logger';
import { UploadSchema } from '@/lib/schemas';


export const PreOrdersService = {
  createPreorder: async (orderData: PreOrderPayload) => {
    return fetchClient('/preorders', {
      method: 'POST',
      body: JSON.stringify(orderData),
    });
  },

  uploadImagesAndData: async (preorder: Pick<PreOrder, 'id' | 'gender' | 'height' | 'weight' | 'frontImage' | 'sideImage'>): Promise<PreOrderResponse> => {
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

    // TODO: comment once endpoint is finished
    // return {
    //   data: {
    //     id,
    //     gender,
    //     weight: Number(weight),
    //     height: Number(height),
    //     frontImage,
    //     sideImage,
    //     createdAt: new Date(),
    //     measurementData: await fetchMock<MeasurementData>('mockMeasurementData')
    //   },
    //   meta: null
    // }

    return fetchClient(`/preorders/${id}/measure`, {
      method: 'POST',
      body: JSON.stringify({
        frontImage,
        sideImage,
        gender,
        weight: Number(weight),
        height: Number(height),
      }),
    })
  },
  updateMeasurements: async (data: PreOrder) => {
    if (data == null || data.measurementData == null) throw new Error('Missing update data')
    // return mutateMockMeasurements(data.measurementData) // TODO: comment once endpoint is finished
    return fetchClient(`/preorders/${data.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
};
