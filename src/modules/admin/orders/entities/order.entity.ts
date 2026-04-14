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

  total_price: z.coerce.number(),

  payment_status: z.enum(['paid', 'not_paid']),
  order_type: z.enum(['delivery', 'pickup']),
  payment_type: z.enum(['courier', 'pickup']),
  status: z.enum(['new', 'in_progress', 'sent', 'done', 'canceled']),

  created_at: z.preprocess((val): Date | unknown => {
    if (val instanceof Date) return val;

    if (typeof val === 'string' || typeof val === 'number') {
      const d = new Date(val);
      if (!isNaN(d.getTime())) return d;
    }

    return val;
  }, z.date()),
});

export type Order = z.infer<typeof orderSchema>;
export type OrderStatus = 'new' | 'in_progress' | 'sent' | 'done' | 'canceled';

const orderItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  quantity: z.number(),
  price: z.coerce.number(),
  total_price: z.coerce.number(),
  image_link: z.string(),
});
export type OrderItem = z.infer<typeof orderItemSchema>;

export const fullOrderSchema = orderSchema.extend({
  products: z.array(orderItemSchema),
});
export const arrayFullOrderSchema = z.array(fullOrderSchema);

export type FullOrder = z.infer<typeof fullOrderSchema>;
