/**
 * View providing addon rules with pre-resolved addon product data.
 *
 * Technical specifications:
 * - Base: addon_rule joined with addon → product
 * - Additional joins:
 *     - product_ingredients_view (ingredients)
 *     - product_categories_view (category_ids)
 *     - product_discount_percent_view (discount_percent)
 * - Filters:
 *     - addon_rule.is_active = true
 *     - product.is_active = true
 * - Aggregation:
 *     - JSON_AGG of enriched product objects per addon_rule
 *     - Ordered by product ID
 * - Output:
 *     - One row per addon_rule with a JSON array of associated products
 * - Update mode: Reflects current state of all related entities
 *
 * ---
 *
 * Представление, возвращающее активные правила добавок с вложенными товарами,
 * соответствующими этим правилам.
 *
 * Технические характеристики:
 * - Основные связи: addon_rule → addon → product
 * - Дополнительные данные:
 *     - ингредиенты (product_ingredients_view)
 *     - категории (product_categories_view)
 *     - скидки (product_discount_percent_view)
 * - Фильтрация:
 *     - addon_rule.is_active = true
 *     - product.is_active = true
 * - Агрегация:
 *     - JSON-массив объектов товаров, сгруппированных по addon_rule
 *     - Отсортировано по product.id
 * - Выходные данные:
 *     - По одной строке на каждое правило добавки
 *     - Вложенный JSON-массив `addon_products`
 * - Режим обновления: отражает актуальное состояние всех связанных таблиц
 *
 * @type {VIEW}
 *
 * @example
 * SELECT * FROM addon_rule_with_addons_view;
 *
 * @return
 * addon_rule_id | title | base_count | ... | addon_products
 * ---------------+-------+------------+-----+---------------------
 * 1              | "Соусы" | 2         | ... | [ { id: 101, title: "Кисло-сладкий", ... }, ... ]
 */
CREATE OR REPLACE VIEW addon_rule_with_addons_view AS
SELECT adr.id                                    AS addon_rule_id,
       adr.title,
       adr.base_count,
       adr.divisor,
       adr.show_count_percent,
       adr.addon_group_id,
       JSON_AGG(
       JSON_BUILD_OBJECT(
               'addon_rule_id', adr.id,
               'id', p.id,
               'title', p.title,
               'is_active', p.is_active,
               'is_visible', p.is_visible,
               'is_set', p.is_set,
               'slug', p.slug,
               'image_link', p.image_link,
               'price', p.price::float8,
               'weight', p.weight,
               'count_portion', p.count_portion,
               'quantity', p.quantity,
               'ingredients', COALESCE(pi.ingredients, ARRAY []::text[]),
               'category_ids', COALESCE(pc.category_ids, ARRAY []::int[]),
               'discount_percent', COALESCE(pd.discount_percent, 0),
               'addons', '[]'::json,
               'set_items', '[]'::json
       )
       ORDER BY p.id
               ) FILTER (WHERE p.id IS NOT NULL) AS addon_products
FROM addon_rule adr
         JOIN addon a ON a.addon_rule_id = adr.id
         JOIN product p ON p.id = a.product_id
         LEFT JOIN product_ingredients_view pi ON pi.product_id = p.id
         LEFT JOIN product_categories_view pc ON pc.product_id = p.id
         LEFT JOIN product_discount_percent_view pd ON pd.product_id = p.id
WHERE adr.is_active = true
  AND p.is_active = true
GROUP BY adr.id;
