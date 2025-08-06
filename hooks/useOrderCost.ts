import { useQuery } from "@tanstack/react-query"
import { type OrderCost } from "@/lib/definitions"
import { OrdersService } from "@/services/orders.service"

export const useOrderCost = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['order-cost'],
    queryFn: OrdersService.getOrderCost,
  })

  return {
    data: data as OrderCost,
    isLoading,
    isError,
    error,
    refetch,
  }
}
