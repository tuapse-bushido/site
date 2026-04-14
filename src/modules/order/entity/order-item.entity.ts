import { z } from 'zod';

export type OrderItem = {
  id: number;

  order_id: number;
  product_id: number;

  quantity_total: number;
  quantity_free: number;

  unit_price: number;
  total_price: number;
};

export type OrderItemPayload = Omit<OrderItem, 'id'>;

export const orderItemSchema = z.object({
  id: z.number(),

  order_id: z.number(),
  product_id: z.number(),

  quantity_total: z.number(),
  quantity_free: z.number(),

  unit_price: z.coerce.number(),
  total_price: z.coerce.number(),
});

export const orderItemArraySchema = z.array(orderItemSchema);
