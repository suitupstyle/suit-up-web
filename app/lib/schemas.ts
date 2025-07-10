// lib/schemas.ts
import { z } from 'zod';

export const ImageSchema = z.object({
  data: z.string().refine((val) => val.startsWith('data:image/'), {
    message: 'Debe ser una imagen en formato Base64',
  }),
  type: z.enum(['image/jpeg', 'image/png', 'image/webp']),
  size: z.number().max(2 * 1024 * 1024, 'The image is larger than 2MB'),
});

export const UploadSchema = z.object({
  frontImage: ImageSchema,
  sideImage: ImageSchema,
});