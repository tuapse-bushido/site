CREATE VIEW product_card_view AS
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
                       JSONB_AGG(
                       JSONB_BUILD_OBJECT(
                               'addon_rule_id', adr.addon_rule_id,
                               'base_count', adr.base_count,
                               'divisor', adr.divisor,
                               'show_count_percent', adr.show_count_percent,
                               'addon_products', adr.addon_products
                       )
                                ) FILTER (WHERE adr.addon_rule_id IS NOT NULL),
                       '[]'::jsonb
       )                                          AS addons,

       -- Состав сета
       COALESCE(
                       JSONB_AGG(
                       JSONB_BUILD_OBJECT(
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
                       '[]'::jsonb
       )                                          AS set_items

FROM product p
-- Ингредиенты
         LEFT JOIN product_ingredients_view pi
                   ON pi.product_id = p.id
-- Категории
         LEFT JOIN product_categories_view pc
                   ON pc.product_id = p.id
-- Скидка
         LEFT JOIN product_discount_percent_view pd
                   ON pd.product_id = p.id
-- Добавки (из продуктов и категорий)
         LEFT JOIN (SELECT atp.product_id,
                           ara.addon_rule_id,
                           ara.base_count,
                           ara.divisor,
                           ara.show_count_percent,
                           ara.addon_products
                    FROM addon_rules_to_products_view atp
                             JOIN addon_rule_with_addons_view ara
                                  ON ara.addon_rule_id = atp.addon_rule_id

                    UNION ALL

                    SELECT pcp.product_id,
                           ara.addon_rule_id,
                           ara.base_count,
                           ara.divisor,
                           ara.show_count_percent,
                           ara.addon_products
                    FROM product_category pcp
                             JOIN addon_rules_to_categories_view atc
                                  ON atc.category_id = pcp.category_id
                             JOIN addon_rule_with_addons_view ara
                                  ON ara.addon_rule_id = atc.addon_rule_id) adr
                   ON adr.product_id = p.id

-- Состав сета
         LEFT JOIN set_items_with_ingredients_view si
                   ON si.set_id = p.id

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
