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
 * | `addon`             | `addon_rule_id`, `product_id`| Used in resolving addons via addon_rule_with_addons_view |
 * | `addon_rule`        | `is_active`                | Filters only valid rules in all addon-related queries      |
 * | `addon_to_product`  | `product_id`, `addon_id`   | Enables fast mapping product ↔ addon rules                 |
 * | `addon_to_category` | `category_id`, `addon_id`  | Enables fast mapping category ↔ addon rules                |
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
 * | `addon`              | `addon_rule_id`, `product_id`| Вьюха addon_rule_with_addons_view                      |
 * | `addon_rule`         | `is_active`               | Фильтрация только активных правил добавок                 |
 * | `addon_to_product`   | `product_id`, `addon_id`  | Связи товар ↔ правило добавки                            |
 * | `addon_to_category`  | `category_id`, `addon_id` | Связи категория ↔ правило добавки                        |
 * | `set_item`           | `set_product_id`, `product_id` | Джойны и пересчёт состава сетов                       |
 */

-- product
CREATE INDEX IF NOT EXISTS idx_product_is_active_visible ON product (is_active, is_visible);

-- product_ingredient
CREATE INDEX IF NOT EXISTS idx_product_ingredient_product_id ON product_ingredient (product_id);

-- product_category
CREATE INDEX IF NOT EXISTS idx_product_category_product_id ON product_category (product_id);
CREATE INDEX IF NOT EXISTS idx_product_category_category_id ON product_category (category_id);

-- addon
CREATE INDEX IF NOT EXISTS idx_addon_addon_rule_id ON addon (addon_rule_id);
CREATE INDEX IF NOT EXISTS idx_addon_product_id ON addon (product_id);

-- addon_rule
CREATE INDEX IF NOT EXISTS idx_addon_rule_is_active ON addon_rule (is_active);

-- addon_rule_to_product
CREATE INDEX IF NOT EXISTS idx_addon_rule_to_product_product_id ON addon_rule_to_product (product_id);
CREATE INDEX IF NOT EXISTS idx_addon_rule_to_product_rule_id ON addon_rule_to_product (addon_rule_id);

-- addon_rule_to_category
CREATE INDEX IF NOT EXISTS idx_addon_rule_to_category_category_id ON addon_rule_to_category (category_id);
CREATE INDEX IF NOT EXISTS idx_addon_rule_to_category_rule_id ON addon_rule_to_category (addon_rule_id);


-- set_item
CREATE INDEX IF NOT EXISTS idx_set_item_set_product_id ON set_item (set_product_id);
CREATE INDEX IF NOT EXISTS idx_set_item_product_id ON set_item (product_id);
