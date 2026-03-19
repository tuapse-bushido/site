import { z } from 'zod';

/**
 * Zod schema for product-category relationship.
 *
 * ---
 *
 * Схема Zod для связи между товаром и категорией.
 *
 * @property {number} product_id - Product ID / ID товара
 * @property {number} category_id - Category ID / ID категории
 *
 * @example
 * const pc: ProductCategoryType = {
 *   product_id: 123,
 *   category_id: 5,
 * };
 */
export const productCategorySchema = z.object({
  product_id: z.number(),
  category_id: z.number(),
});

export const productCategoryArraySchema = z.array(productCategorySchema);
export type ProductCategoryType = z.infer<typeof productCategorySchema>;
