import { z } from 'zod';

const baseAccessPayloadSchema = z.object({
  sub: z.string(),
  sid: z.uuid(),
  role: z.enum(['superuser', 'admin']),
});

const baseSessionRowSchema = z.object({
  id: z.uuid(),
});

const sessionRevokeReasonSchema = z.enum([
  'logout',
  'manual',
  'expired',
  'rotated',
  'logout_all',
  'legacy_revoked',
  'admin_not_found',
  'account_disabled',
  'password_changed',
  'refresh_reuse_detected',
]);

const baseSessionSchema = baseSessionRowSchema.extend({
  admin_id: z.number(),
  created_at: z.date(),
  expires_at: z.date(),
  refresh_token_hash: z.string().regex(/^[0-9a-f]{64}$/),
  last_used_at: z.date().nullable(),
  revoked_at: z.date().nullable(),
  revoke_reason: sessionRevokeReasonSchema.nullable(),
  ip_address: z.union([z.ipv4(), z.ipv6()]).nullable(),
  user_agent: z.string().nullable(),
  is_revoked: z.boolean(),
});

export const sessionSchemas = {
  session: {
    row: baseSessionRowSchema,
    base: baseSessionSchema,
    revokeReason: sessionRevokeReasonSchema,
  },
  token: {
    accessPayload: baseAccessPayloadSchema,
  },
};

export type AccessPayload = z.infer<typeof sessionSchemas.token.accessPayload>;

export type SessionRow = z.infer<typeof sessionSchemas.session.row>;
export type Session = z.infer<typeof sessionSchemas.session.base>;
export type SessionRevokeReason = z.infer<typeof sessionSchemas.session.revokeReason>;
