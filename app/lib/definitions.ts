import { z } from 'zod';
import { measurementsTagMap } from '@/app/lib/utils';
import { type User, type UserMetadata } from '@supabase/supabase-js';
import { LoginSchema, PaymentSchema, PreOrderSchema, UserSchema, UUIDSchema } from '@/app/lib/schemas';

export type UUID = z.infer<typeof UUIDSchema>;

export type AppUser = User & {
  user_metadata: UserMetadata & {
    full_name: string,
    is_admin: boolean,
  }
}

export type Item = {
  id: number,
  name: string,
  desc: string
  price: number
  imageUrl?: string
}

export type CreateOrderDTO = {
  preorderId: string
  orderType: string
  orderQuantity: number
  orderLeadTime: number
  customerName: string
  customerEmail: string
  customerPassword: string
  jacketBook: string
  jacketFabric: string
}

export type CreateOrderApiResponse = {
  data: {
    id: number
    pricingData: {
      currency: string
      price: number
    }
    items: Item[]
    isPaid: boolean
  }
}

export type CreatePaymentIntentDTO = {
  amount: number
  currency?: 'usd' | 'cny'
  orderId: number
}

export type CreatePaymentIntentApiResponse = {
  data: {
    clientSecret: string
  }
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

export type PreOrderFormData = z.infer<typeof PreOrderSchema>

export type OrderResponse = {
  id: UUID
}

export type UserFormData = z.infer<typeof UserSchema>

/**
 * @deprecated
 */
export type DetailsResponse = {
  status: 'ok'
}


export type PaymentFormData = z.infer<typeof PaymentSchema>

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


export type LoginFormData = z.infer<typeof LoginSchema>

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
