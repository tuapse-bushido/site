import { pool } from '@/libs/db/db';
import { Product, productArraySchema } from '@/types/db/product';

/**
 * Fetches all products from the database.
 *
 * Executes a `SELECT *` query on the `product` table and parses the result
 * using the `productArraySchema` to ensure type safety.
 *
 * ---
 *
 * Получает все товары из базы данных.
 *
 * Выполняет `SELECT *` по таблице `product` и валидирует результат через `productArraySchema`.
 *
 * @returns Array of `Product` objects /
 * Массив объектов `Product`.
 *
 * @example
 * await getAllProducts();
 * [
 *   {
 *     id: 42,
 *     title: "Филадельфия",
 *     is_active: true,
 *     slug: "philadelphia",
 *     category_id: 1,
 *     image_link: "https://example.com/images/philadelphia.jpg",
 *     price: 390,
 *     weight: 210,
 *     count_portion: 8,
 *     created_at: "2024-01-20T10:30:00.000Z",
 *     updated_at: "2024-04-01T14:45:00.000Z"
 *   }
 * ]
 */
export const getAllProducts = async (): Promise<Product[]> => {
  const response = await pool.query(`SELECT *
                                     FROM product`);

  return productArraySchema.parse(response.rows);
};
