/**
 * View providing resolved discount percentages for each active and visible product.
 *
 * Technical specifications:
 * - Source tables: product → product_discount / category_discount → discount
 * - Discount source resolution:
 *     1. Product-specific discount (product_discount)
 *     2. Category-level discount (category_discount)
 * - Joins:
 *     - LEFT JOIN on both discount sources using COALESCE
 * - Filter conditions:
 *     - p.is_active = true
 *     - p.is_visible = true
 *     - At least one discount is present
 *     - Discount must be active (d.is_active = true)
 * - Output: product_id + discount_percent (from either source)
 * - Update mode: Always reflects current base table data
 *
 * ---
 *
 * Представление с итоговыми процентами скидок для активных и видимых товаров.
 *
 * Технические характеристики:
 * - Источники: product → product_discount / category_discount → discount
 * - Приоритет источника скидки:
 *     1. Индивидуальная скидка на продукт
 *     2. Скидка через категорию
 * - Присоединения:
 *     - LEFT JOIN и выборка через COALESCE
 * - Условия фильтрации:
 *     - p.is_active = true
 *     - p.is_visible = true
 *     - Есть хотя бы одна скидка (на продукт или категорию)
 *     - Скидка активна (d.is_active = true)
 * - Выходные данные: product_id и discount_percent (от продукта или категории)
 * - Режим обновления: отображает всегда актуальные данные базовых таблиц
 *
 * @type {VIEW}
 *
 * @example
 * SELECT * FROM product_discount_percent_view;
 *
 * @return
 * product_id | discount_percent
 * -----------+-------------------
 * 42         | 15
 * 99         | 10
 */
create or replace view product_discount_percent_view as
SELECT p.id      AS product_id,
       d.percent AS discount_percent
FROM product p
         LEFT JOIN product_discount pd ON pd.product_id = p.id
         LEFT JOIN product_category pc ON pc.product_id = p.id
         LEFT JOIN category_discount cd ON cd.category_id = pc.category_id
         LEFT JOIN discount d ON d.id = COALESCE(pd.discount_id, cd.discount_id)
WHERE p.is_active = true
  AND p.is_visible = true
  AND (pd.discount_id IS NOT NULL OR cd.discount_id IS NOT NULL)
  AND d.is_active = true
GROUP BY p.id, d.percent;