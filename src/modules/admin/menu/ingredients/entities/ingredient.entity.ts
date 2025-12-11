import { z } from 'zod';

export const ingredientEntity = z.object({
  id: z.number(),
  title: z.string(),
});

export const ingredientArraySchema = z.array(ingredientEntity);

export type Ingredient = z.infer<typeof ingredientEntity>;
