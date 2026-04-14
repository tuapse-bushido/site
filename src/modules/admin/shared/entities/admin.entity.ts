import { z } from 'zod';

export const ADMIN_ROLES = ['superuser', 'admin'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const adminRoleSchema = z.enum(ADMIN_ROLES);

export const adminEntity = z.object({
  id: z.number(),
  login: z.string(),
  password_hash: z.string(),
  role: adminRoleSchema,
  is_active: z.boolean(),
  created_at: z.date(),
});

export type Admin = z.infer<typeof adminEntity>;
