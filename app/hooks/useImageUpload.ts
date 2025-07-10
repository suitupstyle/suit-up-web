import { useMutation } from '@tanstack/react-query';
import { OrdersService } from '../services/orders.service';

export const useImageUpload = () => {
  return useMutation({
    mutationFn: OrdersService.uploadImage,
  });
};