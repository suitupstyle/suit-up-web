import { useMutation } from '@tanstack/react-query';
import { OrdersService } from '../services/orders.service';

export const useUploadImages = () => {
  return useMutation({
    mutationFn: OrdersService.uploadImages,
  });
};