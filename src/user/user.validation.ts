import { z, ZodType } from "zod";

export class UserValidation {
  static readonly REGISTER: ZodType = z.object({
    username: z.string().min(3).max(255),
    password: z.string().min(8).max(255),
    name: z.string().min(3).max(255),
  })

  static readonly LOGIN: ZodType = z.object({
    username: z.string().min(3).max(255),
    password: z.string().min(8).max(255),
  });
}