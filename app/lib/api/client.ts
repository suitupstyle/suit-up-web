import { measurements } from "../placeholder-data";
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


const mockDatas = {
  measurements: () => measurements
}

type mockData = keyof typeof mockDatas
export const fetchMock = async (data: mockData) => {
  return promisifyWithDelay(mockDatas[data])
}