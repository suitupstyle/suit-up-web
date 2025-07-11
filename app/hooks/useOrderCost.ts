import { useQuery } from "@tanstack/react-query"
import { OrdersService } from "../services/orders.service"
import { OrderCost } from "../lib/definitions"
import { logger } from "../lib/logger"

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