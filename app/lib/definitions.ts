import { z } from 'zod';
import { measurementsTagMap } from './utils';

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
const uuidSchema = z.string().uuid();
export type UUID = z.infer<typeof uuidSchema>;

export function validateUUID(value: unknown): UUID {
  return uuidSchema.parse(value);
}

export type Item = {
  id: number,
  name: "Black Professional Business Suit",
  desc: string
  price: number
  imageUrl?: string
}

export type ItemsResponse = {
  data: Item[],
  meta: {
    page: number,
    limit: number,
    total: number
  }
}

export type PreOrderPayload = {
  itemIds: number[]
}

export type PreOrderResponse = {
  data: PreOrder;
  meta: null;
}

export type PreOrder = {
  id: UUID | null;
  createdAt: Date | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  frontImage: string | null;
  sideImage: string | null;
  measurementData?: MeasurementData;
  items?: Item[];
}

export type MeasurementData = {
  id: number;
  url: string;
  gender: PreOrder['gender'];
  height: PreOrder['height'];
  volume_params: VolumeParams;
  front_params: FrontParams;
  side_params: SideParams;
}

/**
 * @internal Just for use inside MeasurementData
 */
export type VolumeParams = {
  "chest": number,
  "waist": number,
  "low_hips": number,
  "high_hips": number,
  "bicep": number,
  "knee": number,
  "ankle": number,
  "wrist": number,
  "calf": number,
  "thigh": number,
  "mid_thigh_girth": number,
  "neck": number,
  "forearm": number,
  "neck_girth": number,
  "neck_girth_relaxed": number,
  "under_bust_girth": number,
  "upper_chest_girth": number,
  "elbow_girth": number,
  "abdomen": number,
  "armscye_girth": number,
  [key: string]: number,
}

/**
 * @internal Just for use inside MeasurementData
 */
export type FrontParams = {
  soft_validation: SoftValidation;
  body_height: number;
  outseam: number;
  outseam_from_upper_hip_level: number;
  inseam: number;
  inside_crotch_length_to_mid_thigh: number;
  inside_crotch_length_to_knee: number;
  inside_crotch_length_to_calf: number;
  crotch_length: number;
  sleeve_length: number;
  underarm_length: number;
  legs_distance: number;
  high_hips: number;
  hip_height: number;
  shoulders: number;
  chest_top: number;
  jacket_length: number;
  shoulder_length: number;
  neck: number;
  waist: number;
  waist_to_low_hips: number;
  waist_to_knees: number;
  nape_to_waist_centre_back: number;
  bust_height: number;
  shoulder_slope: number;
  shoulder_to_waist: number;
  side_neck_point_to_armpit: number;
  back_neck_height: number;
  back_neck_point_to_wrist_length: number;
  upper_hip_height: number;
  waist_height: number;
  across_back_width: number;
  outer_ankle_height: number;
  knee_height: number;
  across_back_shoulder_width: number;
  total_crotch_length: number;
  inside_leg_height: number;
  neck_length: number;
  upper_arm_length: number;
  lower_arm_length: number;
  upper_hip_to_hip_length: number;
  back_shoulder_width: number;
  rise: number;
  back_neck_to_hip_length: number;
  torso_height: number;
  front_crotch_length: number;
  back_crotch_length: number;
}

/**
 * @internal Just for use inside MeasurementData
 */
export type SoftValidation = {
  messages: string;
}

/**
 * @internal Just for use inside MeasurementData
 */
export type SideParams = {
  soft_validation: SoftValidation;
  neck_to_chest: number;
  chest_to_waist: number;
  waist_to_ankle: number;
  shoulders_to_knees: number;
  side_upper_hip_level_to_knee: number;
  side_neck_point_to_upper_hip: number;
}

export const preOrderSchema = z.object({
  gender: z.enum(['male', 'female']),
  height: z.coerce.number(),
  weight: z.coerce.number(),
})

export type PreOrderFormData = z.infer<typeof preOrderSchema>

export type OrderResponse = {
  id: UUID
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
  items: Item[],
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

export type MeasurementsTags = keyof typeof measurementsTagMap