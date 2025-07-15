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
  imageUrl?: string
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

export const paymentSchema = z
  .object({
    paymentMethod: z.enum(['stripe', 'paypal', 'alipay', 'applepay']),
    cardHolderName: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .optional(),
    email: z.string().email('Invalid email address').optional(),
    expirationDate: z
      .string()
      .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiration date')
      .optional(),
    cvv: z
      .string()
      .min(3, 'CVV must be at least 3 digits')
      .max(4, 'CVV too long')
      .optional(),
    streetAddress: z.string().min(5, 'Address too short').optional(),
    city: z.string().min(2, 'City name too short').optional(),
  })
  .superRefine((data, ctx) => {
    if (data.paymentMethod === 'stripe') {
      if (!data.cardHolderName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Card holder name is required',
          path: ['cardHolderName'],
        })
      }
      if (!data.email) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Email is required',
          path: ['email'],
        })
      }
      if (!data.expirationDate) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Expiration date is required',
          path: ['expirationDate'],
        })
      }
      if (!data.cvv) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'CVV is required',
          path: ['cvv'],
        })
      }
      if (!data.streetAddress) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Street address is required',
          path: ['streetAddress'],
        })
      }
      if (!data.city) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'City is required',
          path: ['city'],
        })
      }
    }
  })

export type PaymentFormData = z.infer<typeof paymentSchema>

export type OrderCost = {
  cost: number,
  taxRate: number,
}

export type PaymentResponse = {
  status: 'ok'
}

export type PaymentConfirmation = {
  orderId: UUID,
  items: Items[],
  amountPayed: number,
  measurementStatus: 'failed' | 'pending' | 'success',
}

export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export type LoginFormData = z.infer<typeof loginSchema>

export type Order = {
  id: string
  customer: string
  product: string
  amount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  date: string
}

export type OrderListResponse = {
  data: Order[],
  meta: {
    page: number,
    limit: number,
    total: number
  }
}