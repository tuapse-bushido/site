/**
 * Materialized view providing aggregated product ingredients.
 *
 * Technical specifications:
 * - Source tables: product_ingredient → ingredient ← product
 * - Filter conditions: product.is_active AND product.is_visible
 * - Output: product_id with raw aggregated ingredient titles (unsorted)
 * - Update mode: Always reflects current base table data
 *
 * ---
 *
 * Представление агрегированных ингредиентов товаров.
 *
 * Технические характеристики:
 * - Источники: product_ingredient → ingredient ← product
 * - Условия фильтрации: только активные и видимые продукты (product.is_active AND product.is_visible)
 * - Выходные данные: product_id и массив названий ингредиентов
 * - Режим обновления: отображает всегда актуальные данные базовых таблиц
 *
 * @type {VIEW}
 *
 * @example
 * -- Basic usage
 * SELECT * FROM product_ingredients_view;
 *
 * @return
 * product_id |               ingredients
 * -----------+-----------------------------------------
 * 123        | {"Рис","Сыр Филадельфия","Огурец","Лосось"}
 */
create or replace view product_ingredients_view as
SELECT pi.product_id,
       ARRAY_AGG(i.title) as ingredients
FROM product_ingredient pi
         JOIN ingredient i ON i.id = pi.ingredient_id
         JOIN product p ON p.id = pi.product_id
WHERE p.is_active = true
  AND p.is_visible = true
GROUP BY pi.product_id;