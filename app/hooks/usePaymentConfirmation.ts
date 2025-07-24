import { useQuery } from "@tanstack/react-query"
import { PreOrdersService } from "../services/preOrders.service"
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
    queryFn: PreOrdersService.getPaymentConfirmation,
  })

  return {
    data: data as PaymentConfirmation,
    isLoading,
    isError,
    error,
    refetch,
  }
}