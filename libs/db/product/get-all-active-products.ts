import { pool } from '@/libs/db/db';
import { Product, productArraySchema } from '@/types/db/product';

/**
 * Fetches all **active products from active categories**.
 *
 * Executes a `SELECT` query on the `product` table (excluding timestamps)
 * where both the product and its related category are active (`is_active = true`).
 * The result is parsed using the `productArraySchema` to ensure type safety.
 *
 * Note: `created_at` and `updated_at` are not included in the query result.
 *
 * ---
 *
 * Получает все **активные товары из активных категорий**.
 *
 * Выполняет `SELECT` запрос к таблице `product` (без полей дат),
 * оставляя только товары с `is_active = true`, у которых категория тоже активна.
 * Результат валидируется через `productArraySchema`.
 *
 * Внимание: поля `created_at` и `updated_at` не запрашиваются.
 *
 * @returns Array of `Product` objects / Массив объектов `Product`.
 *
 * @example
 * await getAllActiveProducts();
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
 *     count_portion: 8
 *   }
 * ]
 */
export const getAllActiveProducts = async (): Promise<Product[]> => {
  const response = await pool.query(`
    SELECT p.id,
           p.title,
           p.is_active,
           p.category_id,
           p.slug,
           p.image_link,
           p.price,
           p.weight,
           p.count_portion
    FROM product p
           JOIN category c ON p.category_id = c.id
    WHERE p.is_active = true
      AND c.is_active = true
  `);

  const products: Product[] = response.rows.map(
    (product: Product): Product => ({
      ...product,
      price: Number(product.price),
    }),
  );

  return productArraySchema.parse(products);
};
