import { logger } from "../logger";

export const handleApiError = (error: Error, context: string) => {
  logger.error(`[API Error] ${context}:`, error);
  // TODO: Error handling based on type
};