import { z } from 'zod';
import { adminRoleSchema } from '@/types/db/enums/admin_role';

export const adminSchema = z.object({
  id: z.number(),
  login: z.string(),
  password_hash: z.string(),
  role: adminRoleSchema,
  is_active: z.boolean(),
  created_at: z.date(),
});

export type AdminType = z.infer<typeof adminSchema>;
