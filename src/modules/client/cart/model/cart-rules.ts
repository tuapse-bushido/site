import { AddonEntry } from './cart-state.types';
import { calculateQuantity, roundMinOne } from './cart-calculations';

/**
 * Перерассчитывает конкретное правило добавки и обновляет общее состояние добавки.
 *
 * На основе параметров и `quantity_parent` обновляет:
 * - `show_count_for_rule`
 * - `max_free_for_rule`
 *
 * Затем вызывает `recalculateQuantityAddon()` для обновления общих значений:
 * `quantity_in_cart`, `max_free_quantity`.
 *
 * @param rule Правило добавки, подлежащее пересчёту
 * @param addon Добавка, к которой относится правило
 *
 * @returns void
 *
 * @example
 * updateRuleAndAddon(ruleEntry, state.addons[addon_product_id]);
 */
export const updateRuleAndAddon = (rule: AddonEntry['addon_rules'][number], addon: AddonEntry): void => {
  const { quantity_parent, base_count, divisor, show_count_percent } = rule;
  const { max_free, show_count } = calculateQuantity(quantity_parent, base_count, divisor, show_count_percent);

  rule.show_count_for_rule = show_count;
  rule.max_free_for_rule = max_free;

  recalculateQuantityAddon(addon);
};

/**
 * Пересчитывает общее количество отображаемых и бесплатных добавок на основе всех применённых правил.
 *
 * Производит суммирование:
 * - `quantity_in_cart`: сумма всех `show_count_for_rule`
 * - `max_free_quantity`: сумма всех `max_free_for_rule`
 *
 * Если `is_user_modified` имеет значение `false`, то `quantity_in_cart` обновляется автоматически.
 *
 * @param addon Добавка, для которой производится перерасчёт
 *
 * @returns void
 *
 * @example
 * recalculateQuantityAddon(state.addons[123]);
 */
export const recalculateQuantityAddon = (addon: AddonEntry): void => {
  let total_in_cart = 0;
  let total_max_free = 0;

  // Используем Object.values только один раз
  const rules = Object.values(addon.addon_rules);
  for (const rule of rules) {
    total_in_cart += rule.show_count_for_rule;
    total_max_free += rule.max_free_for_rule;
  }

  if (!addon.is_user_modified) {
    addon.quantity_in_cart = roundMinOne(total_in_cart);
  }

  addon.max_free_quantity = roundMinOne(total_max_free);
};
