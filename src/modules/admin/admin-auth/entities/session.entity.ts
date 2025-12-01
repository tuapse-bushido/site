import { z } from 'zod';

export const sessionRowSchema = z.object({
  id: z.string(),
});

export type SessionRow = z.infer<typeof sessionRowSchema>;

export const sessionSchema = sessionRowSchema.extend({
  admin_id: z.number(),
  created_at: z.date(),
  expires_at: z.date(),
  is_revoked: z.boolean(),
});

export type Session = z.infer<typeof sessionSchema>;
