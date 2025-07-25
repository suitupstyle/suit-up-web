import { UUID } from "./definitions";
import { UUIDSchema } from "./schemas";

export const formatCurrency = (amount: number) => {
  return (amount / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

export const formatDateToLocal = (
  dateStr: string,
  locale: string = 'en-US',
) => {
  const date = new Date(dateStr);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  };
  const formatter = new Intl.DateTimeFormat(locale, options);
  return formatter.format(date);
};

export const isBase64Image = (str: string): boolean => {
  return /^data:image\/(png|jpeg|jpg|gif|webp);base64,/.test(str);
}

export function promisifyWithDelay<T>(
  value: T | (() => T),
  delayMs: number = 0
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const result = typeof value === "function" ? (value as () => T)() : value;
      resolve(result);
    }, delayMs);
  });
}

export const measurementsTagMap = {
  'chest': 'volume_params.chest',
  'stomach': 'volume_params.waist',
  'seat': 'volume_params.low_hips',
  'bicep': 'volume_params.bicep',
  'sleeve Length L': 'front_params.sleeve_length',
  'sleeve Length R': 'front_params.sleeve_length',
  'back Length': 'front_params.new_jacket_length',
  'shoulder': 'front_params.shoulders',
  'wrist': 'volume_params.wrist',
  'neck': 'volume_params.neck',
  'pants Waist': 'volume_params.high_hips',
  'hips Seat': 'volume_params.low_hips',
  'thigh': 'volume_params.thigh',
  'u Crotch': 'front_params.crotch_length',
  'pants Length L': 'front_params.outseam',
  'pants Length R': 'front_params.outseam',
  'knee': 'volume_params.knee',
  'calf Bottom': 'volume_params.calf',
  'waist Coat Back Length': 'front_params.new_jacket_length',
}

export function validateUUID(value: unknown): UUID {
  return UUIDSchema.parse(value);
}