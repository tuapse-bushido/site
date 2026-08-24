/**
 * View mapping categories to active addon rules.
 *
 * Technical specifications:
 * - Source: addon_rule_target_category → addon_rule
 * - Filter: only addon rules where is_active = true
 * - Output: category_id and corresponding addon_rule_id
 * - Use case: defines which addon rules are assigned to each category
 * - Update mode: reflects current state of addon_rule table
 *
 * ---
 *
 * Представление, отображающее связь категорий с активными правилами добавок.
 *
 * Технические характеристики:
 * - Источник: addon_rule_target_category → addon_rule
 * - Фильтрация: только активные правила добавок (is_active = true)
 * - Выходные данные: category_id и addon_rule_id
 * - Назначение: определяет, какие правила добавок применяются к каким категориям
 * - Режим обновления: отображает текущее состояние таблицы addon_rule
 *
 * @type {VIEW}
 *
 * @example
 * SELECT * FROM addon_rules_to_categories_view;
 *
 * @return
 * category_id | addon_rule_id
 * ------------+-----------
 *     12      |     3
 *     15      |     4
 */
CREATE OR REPLACE VIEW addon_rules_to_categories_view AS
SELECT artc.category_id,
       artc.addon_rule_id
FROM addon_rule_target_category artc
         JOIN addon_rule adr ON adr.id = artc.addon_rule_id
WHERE adr.is_active = true;
