import { type MeasurementData } from "@/app/lib/definitions";
import { createOrderResponse, detailsResponse, items, itemsResponse, orderCost, orders, ordersResponse, paymentConfirmation, paymentResponse, mockMeasurementData } from "@/app/lib/placeholder-data";
import { promisifyWithDelay } from "@/app/lib/utils";

export const API_UNREACHABLE_MESSAGE =
  "Can't reach the SuitUp API. Check that it is running and try again."

export type ApiValidationIssue = {
  field: string
  message: string
}

export class ApiError extends Error {
  readonly status: number
  readonly validationErrors: ApiValidationIssue[]

  constructor(
    message: string,
    options: { status: number; validationErrors?: ApiValidationIssue[] },
  ) {
    super(message)
    this.name = 'ApiError'
    this.status = options.status
    this.validationErrors = options.validationErrors ?? []
  }
}

type ApiErrorBody = {
  error?: {
    message?: string
  }
  validation?: {
    errors?: unknown
  }
}

export async function fetchClient(url: string, options?: RequestInit) {
  let response: Response

  try {
    response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    })
  } catch {
    throw new Error(API_UNREACHABLE_MESSAGE)
  }

  if (!response.ok) {
    throw await createApiError(response)
  }

  try {
    return await response.json()
  } catch {
    throw new Error(API_UNREACHABLE_MESSAGE)
  }
}

async function createApiError(response: Response): Promise<ApiError> {
  try {
    const body = (await response.json()) as ApiErrorBody
    const validationErrors = parseValidationErrors(body)
    if (validationErrors.length > 0) {
      return new ApiError(
        validationErrors.map((issue) => issue.message).join('\n'),
        { status: response.status, validationErrors },
      )
    }

    if (typeof body?.error?.message === 'string' && body.error.message.trim().length > 0) {
      return new ApiError(body.error.message, { status: response.status })
    }
  } catch {
    // Response was not JSON; fall through to the status fallback.
  }

  return new ApiError(`Request failed (${response.status})`, {
    status: response.status,
  })
}

function parseValidationErrors(body: ApiErrorBody): ApiValidationIssue[] {
  const errors = body?.validation?.errors
  if (!Array.isArray(errors)) {
    return []
  }

  return errors.flatMap((issue) => {
    if (!issue || typeof issue !== 'object') {
      return []
    }

    const message =
      typeof (issue as { message?: unknown }).message === 'string'
        ? (issue as { message: string }).message.trim()
        : ''
    if (!message) {
      return []
    }

    const field =
      typeof (issue as { field?: unknown }).field === 'string'
        ? (issue as { field: string }).field
        : ''

    return [{ field, message }]
  })
}

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
