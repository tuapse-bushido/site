/**
 * View mapping categories to active addon rules.
 *
 * Technical specifications:
 * - Source: addon_to_category → addon_rule
 * - Filter: only addon rules where is_active = true
 * - Output: category_id and corresponding addon_rule ID (as addon_id)
 * - Use case: defines which addon rules are assigned to each category
 * - Update mode: reflects current state of addon_rule table
 *
 * ---
 *
 * Представление, отображающее связь категорий с активными правилами добавок.
 *
 * Технические характеристики:
 * - Источник: addon_to_category → addon_rule
 * - Фильтрация: только активные правила добавок (is_active = true)
 * - Выходные данные: category_id и addon_id (ID правила добавки)
 * - Назначение: определяет, какие правила добавок применяются к каким категориям
 * - Режим обновления: отображает текущее состояние таблицы addon_rule
 *
 * @type {VIEW}
 *
 * @example
 * SELECT * FROM addon_rules_to_categories_view;
 *
 * @return
 * category_id | addon_id
 * ------------+-----------
 *     12      |     3
 *     15      |     4
 */
CREATE OR REPLACE VIEW addon_rules_to_categories_view AS
SELECT
    atc.category_id,
    atc.addon_id
FROM addon_to_category atc
         JOIN addon_rule adr ON adr.id = atc.addon_id
WHERE adr.is_active = true;
