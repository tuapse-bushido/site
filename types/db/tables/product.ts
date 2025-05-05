import { z } from 'zod';

/**
 * Zod schema for a product.
 *
 * Fields:
 * - id (number): Unique identifier of the product.
 * - title (string): Product name.
 * - is_active (boolean): Whether the product is active.
 * - is_visible (boolean): Whether the product is visible to users.
 * - is_set (boolean): Whether the product is a set of items.
 * - slug (string): URL-friendly unique identifier.
 * - image_link (string): URL of the product image.
 * - price (number): Product price (non-negative).
 * - weight (number): Product weight in grams (non-negative).
 * - count_portion (number): Number of portions (non-negative).
 * - quantity (number): Total quantity of this product (non-negative).
 *
 * ---
 * Схема Zod для товара.
 *
 * Поля:
 * - id (number): Уникальный идентификатор товара.
 * - title (string): Название товара.
 * - is_active (boolean): Признак того, что товар активен.
 * - is_visible (boolean): Признак того, что товар видим пользователям.
 * - is_set (boolean): Является ли товар набором (сетом).
 * - slug (string): Уникальный идентификатор для URL.
 * - image_link (string): Ссылка на изображение товара.
 * - price (number): Цена товара (неотрицательное число).
 * - weight (number): Вес товара в граммах (неотрицательное число).
 * - count_portion (number): Количество порций (неотрицательное число).
 * - quantity (number): Количество единиц товара (неотрицательное число).
 */
export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  is_active: z.boolean(),
  is_visible: z.boolean(),
  is_set: z.boolean(),
  slug: z.string(),
  image_link: z.string(),
  price: z.number().nonnegative(),
  weight: z.number().nonnegative(),
  count_portion: z.number().nonnegative(),
  quantity: z.number().nonnegative(),
});

/**
 * Inferred TypeScript type for a product.
 *
 * ---
 * Тип товара, выведенный из схемы.
 */
export type Product = z.infer<typeof productSchema>;
