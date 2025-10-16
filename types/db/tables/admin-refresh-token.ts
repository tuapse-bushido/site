import { z } from 'zod';

export const adminRefreshTokenSchema = z.object({
  id: z.string(),
  admin_id: z.number(),
  created_at: z.date(),
  expires_at: z.date(),
  is_revoked: z.boolean(),
});

export type AdminRefreshTokenType = z.infer<typeof adminRefreshTokenSchema>;

export const refreshTokenRowSchema = z.object({
  id: z.string(),
});

export type RefreshTokenRowType = z.infer<typeof refreshTokenRowSchema>;
