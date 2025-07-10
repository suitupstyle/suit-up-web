import { useQuery } from "@tanstack/react-query"
import { OrdersService } from "../services/orders.service"
import { Measurements } from "../lib/definitions"

export const useMeasurements = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['measurements'],
    queryFn: OrdersService.getMeasurements,
  })

  return {
    measurements: data as Measurements,
    isLoading,
    isError,
    error,
    refetch,
  }
}