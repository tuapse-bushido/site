/**
 * View listing products included in set items along with their ingredients.
 *
 * Technical specifications:
 * - Source: set_item → product → product_ingredient → ingredient
 * - Filter: only active products (product.is_active = true)
 * - Aggregation: ARRAY_AGG of unique ingredient titles (alphabetically sorted)
 * - Output: one row per product-in-set with resolved product data and ingredients
 * - Use case: used to render the contents of product sets with full item details
 * - Update mode: reflects current state of all related tables
 *
 * ---
 *
 * Представление, отображающее состав наборов (сет-продуктов) с деталями вложенных товаров и их ингредиентами.
 *
 * Технические характеристики:
 * - Источник: set_item → product → product_ingredient → ingredient
 * - Фильтрация: только активные продукты (product.is_active = true)
 * - Агрегация: ARRAY_AGG уникальных названий ингредиентов, отсортированных по алфавиту
 * - Выходные данные: одна строка на товар в составе сета, включая все его поля и ингредиенты
 * - Назначение: используется для отображения состава наборов с подробностями по каждому товару
 * - Режим обновления: отображает текущее состояние всех связанных таблиц
 *
 * @type {VIEW}
 *
 * @example
 * SELECT * FROM set_items_with_ingredients_view;
 *
 * @return
 * set_id | id  | title       | price | ingredients
 * -------+-----+-------------+-------+-------------------------------
 *   10   | 201 | "Филадельфия" | 390   | {"Лосось", "Рис", "Сыр"}
 */
CREATE OR REPLACE VIEW set_items_with_ingredients_view AS
SELECT si.set_product_id                            AS set_id,

       -- Все поля продукта с псевдонимами
       p.id                                         AS id,
       p.title                                      AS title,
       p.is_active,
       p.is_visible,
       p.is_set,
       p.slug,
       p.image_link,
       p.price::float8                              AS price,
       p.weight,
       p.count_portion,
       p.quantity,

       ARRAY_AGG(DISTINCT i.title ORDER BY i.title) AS ingredients

FROM set_item si
         JOIN product p ON p.id = si.product_id
         LEFT JOIN product_ingredient pi ON pi.product_id = p.id
         LEFT JOIN ingredient i ON i.id = pi.ingredient_id

WHERE p.is_active = true

GROUP BY si.set_product_id,
         p.id,
         p.title,
         p.is_active,
         p.is_visible,
         p.is_set,
         p.slug,
         p.image_link,
         p.price,
         p.weight,
         p.count_portion,
         p.quantity;
