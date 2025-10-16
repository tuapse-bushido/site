import { z } from 'zod';
import { orderSchema } from '@/types/db/tables/order';

const productInOrderSchema = z.object({
  title: z.string(),
  quantity: z.number(),
});

export const fullOrderSchema = orderSchema.extend({
  products: z.array(productInOrderSchema),
});

export const fullOrderArraySchema = z.array(fullOrderSchema);

export type FullOrder = z.infer<typeof fullOrderSchema>;
