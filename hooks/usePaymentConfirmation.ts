import { useQuery } from "@tanstack/react-query"
import { type PaymentConfirmation } from "@/lib/definitions"
import { OrdersService } from "@/services/orders.service"

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
