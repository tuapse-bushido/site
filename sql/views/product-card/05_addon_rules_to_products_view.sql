/**
 * View mapping products to active addon rules.
 *
 * Technical specifications:
 * - Source: addon_to_product → addon_rule
 * - Filter: only addon rules with is_active = true
 * - Output: product_id and corresponding addon_rule ID (as addon_id)
 * - Use case: defines which addon rules are assigned to each product
 * - Update mode: reflects current state of addon_rule table
 *
 * ---
 *
 * Представление, отображающее связь товаров с активными правилами добавок.
 *
 * Технические характеристики:
 * - Источник: addon_to_product → addon_rule
 * - Фильтрация: только активные правила добавок (is_active = true)
 * - Выходные данные: product_id и addon_id (ID правила добавки)
 * - Назначение: определяет, какие правила добавок применяются к каким товарам
 * - Режим обновления: отображает текущее состояние таблицы addon_rule
 *
 * @type {VIEW}
 *
 * @example
 * SELECT * FROM addon_rules_to_products_view;
 *
 * @return
 * product_id | addon_id
 * -----------+-----------
 *     101    |    3
 *     101    |    4
 *     205    |    2
 */
CREATE OR REPLACE VIEW addon_rules_to_products_view AS
SELECT product_id,
       addon_rule_id
FROM addon_rule_to_product arp
         JOIN addon_rule adr ON adr.id = arp.addon_rule_id
WHERE adr.is_active = true;

