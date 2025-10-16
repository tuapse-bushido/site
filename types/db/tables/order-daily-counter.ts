import { z } from 'zod';

export const orderDailyCounterSchema = z.object({
  order_date: z.coerce.date(),
  counter: z.number().int().nonnegative(),
});

export type OrderDailyCounter = z.infer<typeof orderDailyCounterSchema>;
