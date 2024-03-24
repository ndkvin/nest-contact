import { z, ZodType } from 'zod';

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(3).max(255),
    last_name: z.string().min(3).max(255),
    phone: z.string().min(9).max(14),
    email: z.string().email(),
  });

  static readonly UPDATE: ZodType = z.object({
    first_name: z.string().min(3).max(255).optional(),
    last_name: z.string().min(3).max(255).optional(),
    phone: z.string().min(9).max(14).optional(),
    email: z.string().email().optional(),
  });
}
