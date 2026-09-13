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

export const UUIDSchema = z.string().uuid();

export const UserSchema = z
  .object({
    full_name: z
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
    is_admin: z.boolean().default(false).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  })

export const LoginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const PreOrderSchema = z.object({
  gender: z.enum(['male', 'female']),
  height: z.coerce.number(),
  weight: z.coerce.number(),
})