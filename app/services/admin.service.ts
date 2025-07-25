import { fetchMock } from "@/app/lib/api/client";
import { handleApiError } from "@/app/lib/api/errorHandler";
import { type OrderListResponse } from "@/app/lib/definitions";

export const AdminOrderService = {
  getOrders: async () => {
    try {
      const res = await fetchMock('ordersResponse') as OrderListResponse // TODO: comment out once endpoint is working
      // const res = await fetchClient('/orders') as OrdersResponse;  // TODO: uncomment once endpoint is working

      const page = Number(res.meta?.page);
      const limit = Number(res.meta?.limit);
      const total = Number(res.meta?.total);

      if (isNaN(page) || isNaN(limit) || isNaN(total)) {
        throw new Error('Invalid pagination metadata');
      }

      return {
        orders: res.data,
        nextPage: page >= Math.ceil(total / limit) ? undefined : page + 1,
      };
    } catch (error) {
      handleApiError(error as Error, 'Failed to fetch orders');
    }
  },
}