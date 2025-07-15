import { useInfiniteQuery } from "@tanstack/react-query"
import { AdminOrderService } from "../services/admin.service"

export const useOrders = () => {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['admin-orders-list'],
    queryFn: AdminOrderService.getOrders,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    initialPageParam: 1,
  })

  return {
    orders: data?.pages?.flatMap((page) => page?.orders),
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  }
}