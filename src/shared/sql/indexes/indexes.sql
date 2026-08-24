/**
 * Index set for optimizing read-heavy operations on product composition and add-ons logic.
 *
 * Covers:
 * - Product visibility and filtering
 * - Ingredient and category lookups
 * - Addon assignment resolution (both product- and category-level)
 * - Set composition joins
 *
 * Key index purposes:
 * | Table               | Column(s)                  | Purpose                                                   |
 * |---------------------|----------------------------|------------------------------------------------------------|
 * | `product`           | `is_active, is_visible`    | Filters visible active products in all public-facing views |
 * | `product_ingredient`| `product_id`               | Speeds up joins for product ingredient mapping             |
 * | `product_category`  | `product_id`, `category_id`| Supports both directions: product→category and reverse     |
 * | `addon_rule_addon_product` | `addon_rule_id`, `product_id` | Resolves products offered by a rule            |
 * | `addon_rule`        | `is_active`                | Filters only valid rules in all addon-related queries      |
 * | `addon_rule_target_product` | `product_id`, `addon_rule_id` | Maps target products to addon rules            |
 * | `addon_rule_target_category` | `category_id`, `addon_rule_id` | Maps target categories to addon rules          |
 * | `set_item`          | `set_product_id`, `product_id` | Powers set composition calculations and joins           |
 *
 * ---
 *
 * Набор индексов для ускорения операций чтения,
 * связанных с карточками товара, составами сетов и логикой добавок.
 *
 * Покрывает:
 * - Фильтрацию активных и видимых продуктов
 * - Быстрый доступ к ингредиентам и категориям
 * - Связывание правил добавок с товарами и категориями
 * - Джойны и пересчёты для set-продуктов
 *
 * Назначение ключевых индексов:
 * | Таблица              | Поле(я)                   | Назначение                                               |
 * |----------------------|---------------------------|-----------------------------------------------------------|
 * | `product`            | `is_active, is_visible`   | Фильтрация во всех клиентских представлениях              |
 * | `product_ingredient` | `product_id`              | Поиск ингредиентов по продукту                            |
 * | `product_category`   | `product_id`, `category_id`| Прямые и обратные связи между товарами и категориями     |
 * | `addon_rule_addon_product` | `addon_rule_id`, `product_id` | Товары, предлагаемые правилом                  |
 * | `addon_rule`         | `is_active`               | Фильтрация только активных правил добавок                 |
 * | `addon_rule_target_product` | `product_id`, `addon_rule_id` | Целевые товары правила                         |
 * | `addon_rule_target_category` | `category_id`, `addon_rule_id` | Целевые категории правила                     |
 * | `set_item`           | `set_product_id`, `product_id` | Джойны и пересчёт состава сетов                       |
 */

-- product
CREATE INDEX IF NOT EXISTS idx_product_is_active_visible ON product (is_active, is_visible);

-- product_ingredient
CREATE INDEX IF NOT EXISTS idx_product_ingredient_product_id ON product_ingredient (product_id);

-- product_category
CREATE INDEX IF NOT EXISTS idx_product_category_product_id ON product_category (product_id);
CREATE INDEX IF NOT EXISTS idx_product_category_category_id ON product_category (category_id);

-- addon_rule_addon_product
CREATE INDEX IF NOT EXISTS idx_addon_rule_addon_product_product_id ON addon_rule_addon_product (product_id);

-- addon_rule
CREATE INDEX IF NOT EXISTS idx_addon_rule_is_active ON addon_rule (is_active);

-- addon_rule_target_product
CREATE INDEX IF NOT EXISTS idx_addon_rule_target_product_product_id ON addon_rule_target_product (product_id);

-- addon_rule_target_category
CREATE INDEX IF NOT EXISTS idx_addon_rule_target_category_category_id ON addon_rule_target_category (category_id);


-- set_item
CREATE INDEX IF NOT EXISTS idx_set_item_set_product_id ON set_item (set_product_id);
CREATE INDEX IF NOT EXISTS idx_set_item_product_id ON set_item (product_id);
