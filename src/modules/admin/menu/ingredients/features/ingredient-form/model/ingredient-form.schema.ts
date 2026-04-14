import { z } from 'zod';

export const ingredientFormSchema = z.object({
  id: z.string().trim().optional(),
  title: z.string().trim().min(1, 'Поле обязательно для заполнения'),
});

export type IngredientFormType = z.infer<typeof ingredientFormSchema>;
