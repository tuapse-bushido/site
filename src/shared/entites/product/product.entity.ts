import { z } from 'zod';

export type Product = {
  id: number;
  title: string;
  is_active: boolean;
  is_visible: boolean;
  slug: string;
  image_link: string;
  price: number;
  weight: number;
  count_portion: number;
  quantity: number;
  is_set: boolean;
};

export const productSchema = z.object({
  id: z.number(),
  title: z.string().trim().min(1).max(50),
  slug: z.string().trim().min(1),

  is_active: z.boolean(),
  is_visible: z.boolean(),
  is_set: z.boolean(),

  image_link: z.string().default('no_image.png'),

  price: z.coerce.number().nonnegative().default(0),

  weight: z.number().nonnegative().default(0),
  count_portion: z.number().int().min(1).default(1),

  quantity: z.number().int().min(1).default(1),
}) satisfies z.ZodType<Product>;
