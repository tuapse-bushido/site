import { z } from 'zod';

export const orderDailyCounterSchema = z.object({
  order_date: z.coerce.date(),
  counter: z.number().int().nonnegative(),
});

export type OrderCounter = z.infer<typeof orderDailyCounterSchema>;
