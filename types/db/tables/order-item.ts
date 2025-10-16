import { z } from 'zod';

export const orderItemSchema = z.object({
  id: z.number(),
  order_id: z.number(),
  product_id: z.number(),
  quantity_total: z.number(),
  quantity_free: z.number(),
  unit_price: z.preprocess((val: unknown): number | unknown => {
    if (val === null || val === undefined) return val;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }, z.number().nonnegative()),
  total_price: z.preprocess((val: unknown): number | unknown => {
    if (val === null || val === undefined) return val;
    const num = Number(val);
    return isNaN(num) ? val : num;
  }, z.number().nonnegative()),
});

export const orderItemArraySchema = z.array(orderItemSchema);
export type OrderItem = z.infer<typeof orderItemSchema>;

type OrderItemPayload = Omit<OrderItem, 'id'>;

export type ColumnWiseOrderItems = {
  [K in keyof OrderItemPayload]: Array<OrderItemPayload[K]>;
};
