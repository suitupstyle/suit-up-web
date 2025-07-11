import { useQuery } from "@tanstack/react-query"
import { OrdersService } from "../services/orders.service"
import { PaymentConfirmation } from "../lib/definitions"

export const usePaymentConfirmation = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['payment-confirmation'],
    queryFn: OrdersService.getPaymentConfirmation,
  })

  return {
    data: data as PaymentConfirmation,
    isLoading,
    isError,
    error,
    refetch,
  }
}