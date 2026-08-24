import { z } from 'zod';

export const baseIngredientSchema = z.object({
  id: z.coerce.number().int().positive('Некорректный ID'),

  title: z
    .string()
    .trim()
    .toLowerCase()
    .transform((val): string => val.replace(/\s+/g, ' '))
    .pipe(z.string().min(1, 'Укажите название ингредиента').max(50, 'Название слишком длинное (макс. 50 символов)')),
});

export const ingredientSchemas = {
  base: baseIngredientSchema,
  array: z.array(baseIngredientSchema),
  create: baseIngredientSchema.omit({ id: true }),
  update: baseIngredientSchema,
  upsert: baseIngredientSchema.partial({ id: true }),
};

export type Ingredient = z.infer<typeof baseIngredientSchema>;
export type InsertIngredient = z.infer<typeof ingredientSchemas.create>;
export type UpsertIngredient = z.infer<typeof ingredientSchemas.upsert>;
