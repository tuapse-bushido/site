import { z } from 'zod';

/**
 * Zod schema for a product.
 *
 * Fields:
 * - id (number): Unique identifier of the product.
 * - title (string): Product name.
 * - is_active (boolean): Whether the product is active and available.
 * - slug (string): URL-friendly unique identifier.
 * - category_id (number | null): ID of the associated category.
 * - image_link (string | null): Image URL for the product.
 * - price (number | null): Product price (non-negative number).
 * - weight (number | null): Product weight in grams (non-negative number).
 * - count_portion (number | null): Number of portions (non-negative number).
 * - created_at (string): Creation timestamp (ISO string).
 * - updated_at (string): Last update timestamp (ISO string).
 *
 * ---
 * Схема Zod для товара.
 *
 * Поля:
 * - id (number): Уникальный идентификатор товара.
 * - title (string): Название товара.
 * - is_active (boolean): Товар активен и доступен.
 * - slug (string): Уникальный идентификатор для URL.
 * - category_id (number | null): ID связанной категории.
 * - image_link (string | null): Ссылка на изображение товара.
 * - price (number | null): Цена товара (неотрицательное число).
 * - weight (number | null): Вес товара в граммах (неотрицательное число).
 * - count_portion (number | null): Количество порций (неотрицательное число).
 * - created_at (string): Дата создания (строка в формате ISO).
 * - updated_at (string): Дата последнего обновления (строка в формате ISO).
 */
export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  is_active: z.boolean(),
  slug: z.string(),
  category_id: z.number().nullable(),
  image_link: z.string().nullable(),
  price: z.number().nonnegative().nullable(),
  weight: z.number().nonnegative().nullable(),
  count_portion: z.number().nonnegative().nullable(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

/**
 * Array schema for multiple products.
 *
 * ---
 * Схема массива товаров.
 */
export const productArraySchema = z.array(productSchema);

/**
 * Inferred TypeScript type for a product.
 *
 * ---
 * Тип товара, выведенный из схемы.
 */
export type Product = z.infer<typeof productSchema>;
