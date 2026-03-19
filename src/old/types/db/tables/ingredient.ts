import { z } from 'zod';

/**
 * Zod schema for a single ingredient.
 *
 * ---
 *
 * Схема Zod для одного ингредиента.
 *
 * Fields / Поля:
 * - id (number): Unique identifier of the ingredient / Уникальный идентификатор ингредиента.
 * - title (string): Display name of the ingredient / Название ингредиента.
 */
export const ingredientSchema = z.object({
  id: z.number(),
  title: z.string(),
});

/**
 * Zod schema for an array of ingredients.
 *
 * ---
 *
 * Схема Zod для массива ингредиентов.
 */
export const ingredientArraySchema = z.array(ingredientSchema);

/**
 * Type inferred from `ingredientSchema`.
 *
 * ---
 *
 * Тип, выведенный из `ingredientSchema`.
 */
export type Ingredient = z.infer<typeof ingredientSchema>;
