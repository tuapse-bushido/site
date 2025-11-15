import { z } from 'zod';

export const ADMIN_ROLES = ['superuser', 'admin'] as const;

export type AdminRole = (typeof ADMIN_ROLES)[number];

export const adminRoleSchema = z.enum(ADMIN_ROLES);
