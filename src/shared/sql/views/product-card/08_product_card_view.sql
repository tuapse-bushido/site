CREATE OR REPLACE VIEW product_card_view AS
WITH addon_rule_assignments AS (
    SELECT atp.product_id,
           ara.addon_rule_id,
           ara.base_count,
           ara.divisor,
           ara.show_count_percent,
           ara.addon_products
    FROM addon_rules_to_products_view atp
             JOIN addon_rule_with_addons_view ara
                  ON ara.addon_rule_id = atp.addon_rule_id

    UNION

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
                  ON ara.addon_rule_id = atc.addon_rule_id
),
product_addons AS (
    SELECT product_id,
           JSONB_AGG(
                   JSONB_BUILD_OBJECT(
                           'addon_rule_id', addon_rule_id,
                           'base_count', base_count,
                           'divisor', divisor,
                           'show_count_percent', show_count_percent,
                           'addon_products', addon_products
                   )
                   ORDER BY addon_rule_id
           ) AS addons
    FROM addon_rule_assignments
    GROUP BY product_id
),
product_set_items AS (
    SELECT set_id,
           JSONB_AGG(
                   JSONB_BUILD_OBJECT(
                           'id', id,
                           'title', title,
                           'is_active', is_active,
                           'is_visible', is_visible,
                           'is_set', is_set,
                           'slug', slug,
                           'image_link', image_link,
                           'price', price,
                           'weight', weight,
                           'count_portion', count_portion,
                           'quantity', quantity,
                           'ingredients', ingredients
                   )
                   ORDER BY id
           ) AS set_items
    FROM set_items_with_ingredients_view
    GROUP BY set_id
)
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
       COALESCE(pa.addons, '[]'::jsonb)           AS addons,

       -- Состав сета
       COALESCE(psi.set_items, '[]'::jsonb)       AS set_items

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
         LEFT JOIN product_addons pa
                   ON pa.product_id = p.id

-- Состав сета
         LEFT JOIN product_set_items psi
                   ON psi.set_id = p.id

WHERE p.is_active = true
  AND p.is_visible = true;
