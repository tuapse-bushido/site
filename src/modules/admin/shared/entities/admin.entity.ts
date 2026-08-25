import { z } from 'zod';

const ADMIN_ROLES = ['superuser', 'admin'] as const;

const baseAdminSchema = z.object({
  id: z.number(),
  login: z.string(),
  password_hash: z.string(),
  role: z.enum(ADMIN_ROLES),
  is_active: z.boolean(),
  created_at: z.date(),
});

export const adminSchemas = {
  base: baseAdminSchema,
};

export type Admin = z.infer<typeof adminSchemas.base>;
