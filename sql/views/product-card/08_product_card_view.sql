/**
 * Composite view aggregating all data needed for product card display.
 *
 * Technical specifications:
 * - Base table: product
 * - Filters:
 *     - product.is_active = true
 *     - product.is_visible = true
 * - Joins:
 *     - product_ingredients_view: ingredient titles (as array)
 *     - product_categories_view: category IDs (as array)
 *     - product_discount_percent_view: numeric discount (fallback to 0)
 *     - addon_rule_with_addons_view via:
 *         - addon_rules_to_products_view
 *         - addon_rules_to_categories_view through product_category
 *     - set_items_with_ingredients_view: detailed composition of sets
 * - Aggregations:
 *     - addons: JSON array of addon rule blocks (one per rule)
 *     - set_items: JSON array of nested product items with ingredients
 * - Output: full enriched product entity for client-side rendering
 *
 * ---
 *
 * Комплексное представление, собирающее все данные для отображения карточки товара.
 *
 * Технические характеристики:
 * - Основная таблица: product
 * - Фильтрация:
 *     - product.is_active = true
 *     - product.is_visible = true
 * - Присоединения:
 *     - product_ingredients_view: массив названий ингредиентов
 *     - product_categories_view: массив ID категорий
 *     - product_discount_percent_view: числовое значение скидки (если есть)
 *     - addon_rule_with_addons_view через:
 *         - addon_rules_to_products_view
 *         - addon_rules_to_categories_view через product_category
 *     - set_items_with_ingredients_view: подробный состав сета
 * - Агрегация:
 *     - addons: JSON-массив правил добавок с продуктами
 *     - set_items: JSON-массив вложенных продуктов с ингредиентами
 * - Выходные данные: расширенная сущность товара для рендера карточки
 *
 * @type {VIEW}
 *
 * @example
 * SELECT * FROM product_card_view WHERE;
 *
 * @return
 * id | title | price | discount_percent | ingredients | category_ids | addons | set_items
 * ---+-------+--------+------------------+-------------+---------------+--------+-----------
 * 42 | ...   | 390.0  | 15               | {...}       | {1, 2}        | [...]  | [...]
 */
CREATE OR REPLACE VIEW product_card_view AS
SELECT p.id,
       p.title,
       p.slug,
       p.image_link,
       p.price::float8                            AS price,
       p.weight,
       p.count_portion,
       p.quantity,
       p.is_set,
       p.is_visible,
       p.is_active,

       -- Ингредиенты
       COALESCE(pi.ingredients, ARRAY []::text[]) AS ingredients,

       -- Категории
       COALESCE(pc.category_ids, ARRAY []::int[]) AS category_ids,

       -- Скидка
       COALESCE(pd.discount_percent, 0)           AS discount_percent,

       -- Добавки
       COALESCE(
                       ARRAY_AGG(
                       JSON_BUILD_OBJECT(
                               'addon_rule_id', adr.addon_rule_id,
                               'base_count', adr.base_count,
                               'divisor', adr.divisor,
                               'show_count_percent', adr.show_count_percent,
                               'addon_products', adr.addon_products
                       )
                                ) FILTER (WHERE adr.addon_rule_id IS NOT NULL),
                       ARRAY []::json[]
       )                                          AS addons,

       COALESCE(
                       ARRAY_AGG(
                       JSON_BUILD_OBJECT(
                               'id', si.id,
                               'title', si.title,
                               'is_active', si.is_active,
                               'is_visible', si.is_visible,
                               'is_set', si.is_set,
                               'slug', si.slug,
                               'image_link', si.image_link,
                               'price', si.price,
                               'weight', si.weight,
                               'count_portion', si.count_portion,
                               'quantity', si.quantity,
                               'ingredients', si.ingredients
                       )
                                ) FILTER (WHERE si.id IS NOT NULL),
                       ARRAY []::json[]
       )                                          AS set_items

FROM product p
-- Ингредиенты
         LEFT JOIN product_ingredients_view pi ON pi.product_id = p.id
-- Категории
         LEFT JOIN product_categories_view pc ON pc.product_id = p.id
-- Скидка
         LEFT JOIN product_discount_percent_view pd ON pd.product_id = p.id
-- Добавки (из продуктов и категорий)
         LEFT JOIN (SELECT atp.product_id,
                           ara.addon_rule_id,
                           ara.title,
                           ara.base_count,
                           ara.divisor,
                           ara.show_count_percent,
                           ara.addon_group_id,
                           ara.addon_products
                    FROM addon_rules_to_products_view atp
                             JOIN addon_rule_with_addons_view ara ON ara.addon_rule_id = atp.addon_rule_id

                    UNION ALL

                    SELECT pcp.product_id,
                           ara.addon_rule_id,
                           ara.title,
                           ara.base_count,
                           ara.divisor,
                           ara.show_count_percent,
                           ara.addon_group_id,
                           ara.addon_products
                    FROM product_category pcp
                             JOIN addon_rules_to_categories_view atc ON atc.category_id = pcp.category_id
                             JOIN addon_rule_with_addons_view ara ON ara.addon_rule_id = atc.addon_rule_id) adr
                   ON adr.product_id = p.id

-- Состав сета
         LEFT JOIN set_items_with_ingredients_view si ON si.set_id = p.id

WHERE p.is_active = true
  AND p.is_visible = true

GROUP BY p.id,
         p.title,
         p.slug,
         p.image_link,
         p.price,
         p.weight,
         p.count_portion,
         p.quantity,
         p.is_set,
         pi.ingredients,
         pc.category_ids,
         pd.discount_percent;
