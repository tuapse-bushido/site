import { pool } from '@/libs/db/db';
import { Category, categoryArraySchema } from '@/types/db/category';

/**
 * Fetches all product categories from the database.
 *
 * Executes a `SELECT *` query on the `category` table and parses the result
 * using the `categoryArraySchema` to ensure type safety.
 *
 * ---
 *
 * Получает все категории товаров из базы данных.
 *
 * Выполняет `SELECT *` по таблице `category` и валидирует результат через `categoryArraySchema`.
 *
 * @returns Array of `Category` objects / Массив объектов `Category`.
 *
 * @example
 * await getAllCategories();
 * [
 *   {
 *     id: 1,
 *     title: "Роллы",
 *     is_active: true,
 *     slug: "rolls",
 *     image_link: "https://example.com/images/rolls.jpg",
 *     sort_number: 1,
 *     created_at: "2024-01-15T12:00:00.000Z",
 *     updated_at: "2024-03-10T09:00:00.000Z"
 *   }
 * ]
 */
export const getAllCategories = async (): Promise<Category[]> => {
  const response = await pool.query(`SELECT *
                                     FROM category`);

  return categoryArraySchema.parse(response.rows);
};
