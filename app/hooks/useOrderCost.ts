import { useQuery } from "@tanstack/react-query"
import { PreOrdersService } from "../services/preOrders.service"
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
    queryFn: PreOrdersService.getOrderCost,
  })

  return {
    data: data as OrderCost,
    isLoading,
    isError,
    error,
    refetch,
  }
}