import { useMutation } from '@tanstack/react-query';
import { OrdersService } from '../services/orders.service';

export const useMeasurementsUpdate = (_onSuccess?: (data: unknown) => void, _onError?: (error: Error) => void) => {
  return useMutation({
    mutationFn: OrdersService.updateMeasurements,
    onSuccess: _onSuccess,
    onError: _onError,
  });
};