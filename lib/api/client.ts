import { type MeasurementData } from "@/lib/definitions";
import { createOrderResponse, detailsResponse, items, itemsResponse, orderCost, orders, ordersResponse, paymentConfirmation, paymentResponse, mockMeasurementData } from "@/lib/placeholder-data";
import { promisifyWithDelay } from "@/lib/utils";

export const fetchClient = async (url: string, options?: RequestInit) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};


const mocksData = {
  items,
  itemsResponse,
  createOrderResponse,
  detailsResponse,
  orderCost,
  paymentResponse,
  paymentConfirmation,
  orders,
  ordersResponse,
  mockMeasurementData,
}

type mockData = keyof typeof mocksData

export const fetchMock = async <T>(data: mockData): Promise<T> => {
  return promisifyWithDelay(mocksData[data], 500) as T
}

export const mutateMockMeasurements = async (partialData: Partial<MeasurementData>): Promise<MeasurementData> => {
  return promisifyWithDelay(() => {
    // Create a completely new object to avoid reference sharing
    const newData: MeasurementData = {
      ...structuredClone(mocksData.mockMeasurementData), // Deep clone existing data
      ...partialData // Apply updates
    };

    mocksData.mockMeasurementData = newData;
    return mocksData.mockMeasurementData
  }, 150);
};
