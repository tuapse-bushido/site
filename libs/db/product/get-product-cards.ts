import { pool } from '@/libs/db/db';
import { ProductCard } from '@/types/db/composite/product-card';
import { unstable_cache } from 'next/cache';

/**
 * Fetches all product cards from the `product_card_view` using PostgreSQL.
 *
 * Uses `unstable_cache` from Next.js to cache the result for 24 hours.
 * The view includes enriched product data: ingredients, category IDs, discount,
 * addons and set items — ready for rendering product cards.
 *
 * ---
 *
 * Получает все карточки товаров из `product_card_view` (PostgreSQL).
 *
 * Кэшируется с помощью `unstable_cache` на 24 часа. Возвращает готовые
 * к отображению данные: ингредиенты, категории, скидки, добавки и состав сета.
 *
 * @returns Promise with array of `ProductCard` / Промис с массивом объектов `ProductCard`
 *
 * @example
 * const cards = await getProductCards();
 * // [
 * //   {
 * //     id: 101,
 * //     title: 'Филадельфия',
 * //     price: 390,
 * //     ingredients: ['Лосось', 'Сыр'],
 * //     addons: [...],
 * //     ...
 * //   }
 * // ]
 */

export const getProductCards = unstable_cache(
  async (): Promise<ProductCard[]> => {
    const response = await pool.query(`
      SELECT id,
             title,
             slug,
             image_link,
             price,
             weight,
             count_portion,
             quantity,
             is_set,
             is_visible,
             is_active,
             ingredients,
             category_ids,
             discount_percent,
             addons,
             set_items
      FROM product_card_view
    `);

    return response.rows;
  },
  ['productCard'],
  { revalidate: 24 * 60 * 60 },
);
