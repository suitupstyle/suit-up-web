import { ApiError, type ApiValidationIssue } from "@/app/lib/api/client";
import { logger } from "@/app/lib/logger";

export function getValidationErrors(error: unknown): ApiValidationIssue[] {
  return error instanceof ApiError ? error.validationErrors : []
}

export function getErrorMessage(error: unknown, fallback: string): string {
  const validationErrors = getValidationErrors(error)
  if (validationErrors.length > 0) {
    return validationErrors.map((issue) => issue.message).join('\n')
  }

  if (error instanceof Error && error.message.trim().length > 0) {
    return error.message
  }

  return fallback
}

export const handleApiError = (error: Error, context: string) => {
  logger.error(`[API Error] ${context}:`, error);
};