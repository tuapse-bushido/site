/**
 * View providing aggregated category IDs for each active and visible product.
 *
 * Technical specifications:
 * - Source tables: product_category → category ← product
 * - Filter conditions:
 *     - product.is_active = true
 *     - product.is_visible = true
 *     - category.is_active = true
 * - Output: product_id with sorted array of category IDs
 * - Update mode: Always reflects current base table data
 *
 * ---
 *
 * Представление, агрегирующее категории для каждого активного и видимого продукта.
 *
 * Технические характеристики:
 * - Источники: product_category → category ← product
 * - Условия фильтрации:
 *     - product.is_active = true
 *     - product.is_visible = true
 *     - category.is_active = true
 * - Выходные данные: product_id и отсортированный массив ID категорий
 * - Режим обновления: отображает всегда актуальные данные базовых таблиц
 *
 * @type {VIEW}
 *
 * @example
 * SELECT * FROM product_categories_view;
 *
 * @return
 * product_id | category_ids
 * -----------+--------------
 * 42         | {1,2,5}
 */
CREATE OR REPLACE VIEW product_categories_view AS
SELECT
    pc.product_id,
    ARRAY_AGG(c.id ORDER BY c.id) AS category_ids
FROM product_category pc
         JOIN product p ON p.id = pc.product_id
         JOIN category c ON c.id = pc.category_id
WHERE p.is_active = true
  AND p.is_visible = true
  AND c.is_active = true
GROUP BY pc.product_id;
