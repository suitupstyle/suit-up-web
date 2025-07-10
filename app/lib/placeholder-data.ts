import { DetailsResponse, ImageUploadResponse, Items, ItemsResponse, Measurements, OrderResponse } from "./definitions";

export const items: Items = {
  id: 1,
  name: 'Black Professional Business Suit',
  desc: 'Description'
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