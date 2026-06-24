import { type DetailsResponse, type Item, type ItemsResponse, type MeasurementData, type Order, type OrderCost, type OrderResponse, type OrderListResponse, type PaymentConfirmation, type PaymentResponse } from "@/app/lib/definitions";

export const items: Item = {
  id: 1,
  name: 'Black Professional Business Suit',
  desc: 'Description',
  price: 99.0,
  imageUrl: '/home-suit.webp'
}

export const itemsResponse: ItemsResponse = {
  data: [items],
  meta: {
    page: 1,
    limit: 1,
    total: 1,
  }
}

export const createOrderResponse: OrderResponse = {
  id: crypto.randomUUID()
}

export const mockMeasurementData: MeasurementData = {
  id: 12345,
  url: "https://api.3dlook.com/measurements/12345",
  gender: "male",
  height: 180,
  volume_params: {
    chest: 98.5,
    waist: 82.3,
    low_hips: 94.7,
    high_hips: 88.2,
    bicep: 32.1,
    knee: 38.5,
    ankle: 22.8,
    wrist: 16.5,
    calf: 36.2,
    thigh: 56.8,
    mid_thigh_girth: 52.3,
    neck: 38.4,
    forearm: 26.7,
    neck_girth: 37.8,
    neck_girth_relaxed: 36.5,
    under_bust_girth: 86.2,
    upper_chest_girth: 95.8,
    elbow_girth: 28.3,
    abdomen: 87.6,
    armscye_girth: 42.1,
  },
  front_params: {
    soft_validation: {
      messages: "All measurements within normal ranges"
    },
    body_height: 180,
    outseam: 102,
    outseam_from_upper_hip_level: 78,
    inseam: 79,
    inside_crotch_length_to_mid_thigh: 45,
    inside_crotch_length_to_knee: 60,
    inside_crotch_length_to_calf: 70,
    crotch_length: 28,
    sleeve_length: 63,
    underarm_length: 42,
    legs_distance: 15,
    high_hips: 90,
    hip_height: 95,
    shoulders: 45,
    chest_top: 92,
    jacket_length: 75,
    shoulder_length: 14.5,
    neck: 38,
    waist: 82,
    waist_to_low_hips: 18,
    waist_to_knees: 56,
    nape_to_waist_centre_back: 46,
    bust_height: 135,
    shoulder_slope: 18,
    shoulder_to_waist: 42,
    side_neck_point_to_armpit: 24,
    back_neck_height: 7,
    back_neck_point_to_wrist_length: 78,
    upper_hip_height: 92,
    waist_height: 105,
    across_back_width: 38,
    outer_ankle_height: 7,
    knee_height: 49,
    across_back_shoulder_width: 41,
    total_crotch_length: 72,
    inside_leg_height: 81,
    neck_length: 12,
    upper_arm_length: 32,
    lower_arm_length: 25,
    upper_hip_to_hip_length: 8,
    back_shoulder_width: 40,
    rise: 28,
    back_neck_to_hip_length: 52,
    torso_height: 60,
    front_crotch_length: 30,
    back_crotch_length: 42
  },
  side_params: {
    soft_validation: {
      messages: "Posture analysis: slight forward head posture detected"
    },
    neck_to_chest: 25,
    chest_to_waist: 20,
    waist_to_ankle: 100,
    shoulders_to_knees: 85,
    side_upper_hip_level_to_knee: 65,
    side_neck_point_to_upper_hip: 60
  }
};

export const detailsResponse: DetailsResponse = {
  status: 'ok'
}

export const orderCost: OrderCost = {
  cost: 900,
  taxRate: 0.08,
}

export const paymentResponse: PaymentResponse = {
  status: 'ok'
}

export const paymentConfirmation: PaymentConfirmation = {
  orderId: crypto.randomUUID(),
  items: [items],
  amountPayed: 972,
  measurementStatus: 'success',
}

export const orders: Order[] = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    product: 'Custom Business Suit',
    amount: 165,
    status: 'processing',
    date: '2023-06-15',
  },
  {
    id: 'ORD-002',
    customer: 'Emma Johnson',
    product: 'Premium Tuxedo',
    amount: 220,
    status: 'shipped',
    date: '2023-06-18',
  },
  {
    id: 'ORD-003',
    customer: 'Michael Brown',
    product: 'Casual Blazer',
    amount: 135,
    status: 'delivered',
    date: '2023-06-10',
  },
  {
    id: 'ORD-004',
    customer: 'Sarah Davis',
    product: 'Executive Suit',
    amount: 195,
    status: 'pending',
    date: '2023-06-20',
  },
  {
    id: 'ORD-005',
    customer: 'Robert Wilson',
    product: 'Wedding Suit',
    amount: 250,
    status: 'processing',
    date: '2023-06-22',
  },
]

export const ordersResponse: OrderListResponse = {
  data: orders,
  meta: {
    page: 1,
    limit: 1,
    total: 1,
  }
}
