import { pool } from '@/libs/db/db';
import { Category, categoryArraySchema } from '@/types/db/category';

/**
 * Fetches all **active** product categories from the database.
 *
 * Executes a `SELECT` query on the `category` table where `is_active = true`,
 * excluding timestamp fields, and parses the result using the `categoryArraySchema`
 * to ensure type safety.
 *
 * Note: `created_at` and `updated_at` are not included in the query result.
 *
 * ---
 *
 * Получает все **активные** категории товаров из базы данных.
 *
 * Выполняет `SELECT` запрос по таблице `category` с фильтрацией `is_active = true`
 * (без полей `created_at` и `updated_at`), и валидирует результат через `categoryArraySchema`.
 *
 * Внимание: поля `created_at` и `updated_at` не запрашиваются.
 *
 * @returns Array of `Category` objects / Массив объектов `Category`.
 *
 * @example
 * await getAllActiveCategories();
 * [
 *   {
 *     id: 1,
 *     title: "Роллы",
 *     is_active: true,
 *     slug: "rolls",
 *     image_link: "https://example.com/images/rolls.jpg",
 *     sort_number: 1
 *   },
 *   ...,
 * ]
 */
export const getAllActiveCategories = async (): Promise<Category[]> => {
  const response = await pool.query(`
    SELECT id, title, slug, is_active, image_link, sort_number
    FROM category
    WHERE is_active = true
  `);

  return categoryArraySchema.parse(response.rows);
};
