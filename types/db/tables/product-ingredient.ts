import { z } from 'zod';

/**
 * Zod schema for product-ingredient relationship.
 *
 * ---
 *
 * Схема Zod для связи между товаром и ингредиентом.
 *
 * @property {number} product_id - Product ID / ID товара
 * @property {number} ingredient_id - Ingredient ID / ID ингредиента
 *
 * @example
 * const pi: ProductIngredientType = {
 *   product_id: 123,
 *   ingredient_id: 99,
 * };
 */
export const productIngredientSchema = z.object({
  product_id: z.number(),
  ingredient_id: z.number(),
});

export const productIngredientArraySchema = z.array(productIngredientSchema);
export type ProductIngredientType = z.infer<typeof productIngredientSchema>;
