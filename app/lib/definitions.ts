import { z } from 'zod';

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
const uuidSchema = z.string().uuid();
export type UUID = z.infer<typeof uuidSchema>;

export function validateUUID(value: unknown): UUID {
  return uuidSchema.parse(value);
}

export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export type Items = {
  id: number,
  name: "Black Professional Business Suit",
  desc: string
}

export type ItemsResponse = {
  data: Items[],
  meta: {
    page: number,
    limit: number,
    total: number
  }
}

export type PreOrderPayload = {
  itemIds: number[]
}

export type OrderResponse = {
  id: UUID
}

export type ImageUploadResponse = {
  status: 'ok'
}

export type Measurements = {
  chest: number,
  stomach: number,
  seat: number,
  sleeveLengthL: number,
  sleeveLengthR: number,
  backLength: number,
  shoulder: number,
  pantsWaist: number,
  thigh: number,
  uCrotch: number,
  pantsLengthL: number,
  pantsLengthR: number,
  calfBottom: number,
  waistcoatBackLength: number,
  [key: string]: number,
}

export const detailsSchema = z
  .object({
    fullName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(50, 'Name too long'),
    email: z.string().email('Invalid email address'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one number'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export type DetailsFormData = z.infer<typeof detailsSchema>

export type DetailsResponse = {
  status: 'ok'
}