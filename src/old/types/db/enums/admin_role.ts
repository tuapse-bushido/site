import { z } from 'zod';

export const adminRoleSchema = z.enum(['superuser', 'admin']);
export type AdminRole = z.infer<typeof adminRoleSchema>;
