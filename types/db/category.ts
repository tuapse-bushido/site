import { z } from 'zod';

/**
 * Zod schema for a product category.
 *
 * Fields:
 * - id (number): Unique identifier of the category.
 * - title (string): Category name.
 * - is_active (boolean): Whether the category is active and visible.
 * - slug (string): URL-friendly unique identifier.
 * - image_link (string | null): Image URL for the category.
 * - sort_number (number): Sort order index.
 * - created_at (string): Creation timestamp (ISO string).
 * - updated_at (string): Last update timestamp (ISO string).
 *
 * ---
 * Схема Zod для категории товаров.
 *
 * Поля:
 * - id (number): Уникальный идентификатор категории.
 * - title (string): Название категории.
 * - is_active (boolean): Категория активна и отображается в интерфейсе.
 * - slug (string): Уникальный идентификатор для URL.
 * - image_link (string | null): Ссылка на изображение категории.
 * - sort_number (number): Порядковый номер для сортировки.
 * - created_at (string): Дата создания (строка в формате ISO).
 * - updated_at (string): Дата последнего обновления (строка в формате ISO).
 */
export const categorySchema = z.object({
  id: z.number(),
  title: z.string(),
  is_active: z.boolean(),
  slug: z.string(),
  image_link: z.string().nullable(),
  sort_number: z.number(),
  created_at: z.string().optional(),
  updated_at: z.string().optional(),
});

/**
 * Array schema for multiple categories.
 *
 * ---
 * Схема массива категорий.
 */
export const categoryArraySchema = z.array(categorySchema);

/**
 * Inferred TypeScript type for a category.
 *
 * ---
 * Тип категории, выведенный из схемы.
 */
export type Category = z.infer<typeof categorySchema>;
