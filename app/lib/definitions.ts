import { z } from 'zod';

// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
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

const uuidSchema = z.string().uuid();
export type UUID = z.infer<typeof uuidSchema>;

export function validateUUID(value: unknown): UUID {
  return uuidSchema.parse(value);
}

export type PreOrderPayload = {
  itemIds: number[]
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
}