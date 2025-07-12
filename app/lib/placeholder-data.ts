import { DetailsResponse, ImageUploadResponse, Items, ItemsResponse, Measurements, Order, OrderCost, OrderResponse, OrderListResponse, PaymentConfirmation, PaymentResponse } from "./definitions";

export const items: Items = {
  id: 1,
  name: 'Black Professional Business Suit',
  desc: 'Description',
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

export const uploadImagesResponse: ImageUploadResponse = {
  status: 'ok'
}

export const measurements: Measurements = {
  chest: 102.92,
  stomach: 86.78,
  seat: 102.19,
  sleeveLengthL: 69.86,
  sleeveLengthR: 69.86,
  backLength: 51.39,
  shoulder: 46.01,
  pantsWaist: 79.64,
  thigh: 62.43,
  uCrotch: 35.11,
  pantsLengthL: 130.96,
  pantsLengthR: 130.96,
  calfBottom: 40.2,
  waistcoatBackLength: 51.39,
}

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