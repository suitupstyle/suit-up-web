import { useInfiniteQuery } from "@tanstack/react-query"
import { ItemsService } from "../services/items.service"

export const useItems = () => {
  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ['items'],
    queryFn: ItemsService.getItems,
    getNextPageParam: (lastPage) => lastPage?.nextPage,
    initialPageParam: 1,
  })

  return {
    items: data?.pages?.flatMap((page) => page?.items),
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
  }
}
