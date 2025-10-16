import { z } from 'zod';

export const smsCodeSchema = z.object({
  id: z.number(),
  phone: z.string().min(11),
  code: z.string().min(6),
  created_at: z.coerce.date(),
});

export type SmsCode = z.infer<typeof smsCodeSchema>;
