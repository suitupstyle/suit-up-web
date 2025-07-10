import { fetchMock } from "../lib/api/client";
import { handleApiError } from "../lib/api/errorHandler";
import { type ItemsResponse } from "../lib/definitions";


export const ItemsService = {
  getItems: async () => {
    try {
      const res = await fetchMock('itemsResponse') as ItemsResponse // TODO: comment out once endpoint is working
      // const res = await fetchClient('/items') as ItemsResponse;  // TODO: uncomment once endpoint is working

      const page = Number(res.meta?.page);
      const limit = Number(res.meta?.limit);
      const total = Number(res.meta?.total);

      if (isNaN(page) || isNaN(limit) || isNaN(total)) {
        throw new Error('Invalid pagination metadata');
      }

      return {
        items: res.data,
        nextPage: page >= Math.ceil(total / limit) ? undefined : page + 1,
      };
    } catch (error) {
      handleApiError(error as Error, 'Failed to fetch items');
    }
  },
};