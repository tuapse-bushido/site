import { z } from 'zod';

export const orderSchema = z.object({
  id: z.number(),
  order_number: z.string(),
  customer_name: z.string(),
  customer_phone: z.string(),
  user_id: z.union([z.number(), z.null()]),

  address_city: z.string().nullable(),
  address_street: z.string().nullable(),
  address_house: z.string().nullable(),
  address_apartment: z.string().nullable(),
  address_floor: z.string().nullable(),
  address_entrance: z.string().nullable(),
  address_intercom: z.string().nullable(),

  total_price: z.preprocess((val: unknown): number | unknown => {
    if (val === null || val === undefined) return val;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }, z.number().nonnegative()),

  payment_status: z.enum(['paid', 'not_paid']),
  order_type: z.enum(['delivery', 'pickup']),
  payment_type: z.enum(['courier', 'pickup']),
  status: z.enum(['new', 'in_progress', 'sent', 'done', 'canceled']),

  created_at: z.preprocess((val: unknown): Date | unknown => {
    if (typeof val === 'string' || val instanceof Date) {
      const d = new Date(val);
      return isNaN(d.getTime()) ? val : d;
    }
    return val;
  }, z.date()),
});

export type Order = z.infer<typeof orderSchema>;
