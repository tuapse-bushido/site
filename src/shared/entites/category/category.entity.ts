import { z } from 'zod';

export type Category = {
  id: number;
  title: string;
  is_active: boolean;
  slug: string;
  image_link: string;
  sort_number: number;
};

export const categorySchema = z.object({
  id: z.number(),
  title: z.string(),
  is_active: z.boolean(),
  slug: z.string(),
  image_link: z.string(),
  sort_number: z.number(),
}) satisfies z.ZodType<Category>;

export const categoryArraySchema = z.array(categorySchema);
