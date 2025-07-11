import { type Measurements } from "../definitions";
import { createOrderResponse, detailsResponse, items, itemsResponse, measurements, orderCost, paymentConfirmation, paymentResponse, uploadImagesResponse } from "../placeholder-data";
import { promisifyWithDelay } from "../utils";

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
  uploadImagesResponse,
  measurements,
  detailsResponse,
  orderCost,
  paymentResponse,
  paymentConfirmation,
}

type mockData = keyof typeof mocksData

export const fetchMock = async (data: mockData) => {
  return promisifyWithDelay(mocksData[data], 150)
}

export const mutateMockMeasurements = async (data: Measurements) => {
  return promisifyWithDelay(
    () => {
      for (const key in data) {
        mocksData.measurements[key] = data[key]
      }
    }, 150
  )
}