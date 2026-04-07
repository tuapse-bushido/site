import { z } from 'zod';

export const checkoutFormSchema = z.discriminatedUnion('order_type', [
  z.object({
    order_type: z.literal('pickup'),
    payment_type: z.enum(['pickup']),

    name: z.string().trim().min(1),
    phone: z.string().trim().min(10),
  }),

  z.object({
    order_type: z.literal('delivery'),
    payment_type: z.enum(['courier']),

    name: z.string().trim().min(1),
    phone: z.string().trim().min(10),

    city: z.string().trim().min(1),
    street: z.string().trim().min(1),
    house: z.string().trim().min(1),

    apartment: z.string().trim(),
    floor: z.string().trim(),
    entrance: z.string().trim(),
    intercom: z.string().trim(),
  }),
]);

export type CheckoutFormType = z.infer<typeof checkoutFormSchema>;
