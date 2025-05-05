import {
  AddAddonInStateFn,
  AddRuleInAddonFn,
  CalculateQuantityFn,
  PruneAddonsForParentFn,
  QuantityResult,
  RecalculateQuantityAddonFn,
  UpdateAddonInStateFn,
  UpdateRuleAndAddonFn,
  UpsertAddonForProductFn,
} from '@/types';

/**
 * Calculates addon limits from the quantity of a parent product and rule parameters.
 *
 * Returns how many addon units can be free (`max_free`)
 * and how many should be visible by default (`show_count`).
 *
 * ---
 *
 * Вычисляет ограничения на добавки на основе количества родительского товара и параметров правила.
 *
 * Возвращает:
 * - `max_free`: максимально допустимое количество бесплатных добавок
 * - `show_count`: сколько добавок показать пользователю по умолчанию
 *
 * @param quantity Количество родительского товара
 * @param base_count Базовое количество бесплатных добавок
 * @param divisor Делитель количества для расчёта кратности
 * @param show_count_percent Процент отображаемых добавок
 *
 * @returns Объект с полями `max_free` и `show_count`
 *
 * @example
 * calculateQuantity(2, 1, 1, 100);
 * // => { max_free: 2, show_count: 2 }
 */
export const calculateQuantity: CalculateQuantityFn = (
  quantity: number,
  base_count: number,
  divisor: number,
  show_count_percent: number,
): QuantityResult => {
  const max_free = (quantity / divisor) * base_count;
  return {
    max_free,
    show_count: max_free * (show_count_percent / 100),
  };
};

/**
 * Rounds a number to the nearest integer, but not less than 1.
 *
 * Ensures that even very small or zero values return at least `1`.
 * Used for addon quantity calculations to avoid invisible or zero states.
 *
 * ---
 *
 * Округляет число до ближайшего целого, но не меньше `1`.
 *
 * Гарантирует, что даже нулевые или близкие к нулю значения возвращают хотя бы `1`.
 * Используется при расчётах количества добавок, чтобы избежать пустых значений.
 *
 * @param value Значение, которое нужно округлить
 * @returns {number} Округлённое число, минимум 1
 *
 * @example
 * roundMinOne(0);       // 1
 * roundMinOne(1.4);     // 1
 * roundMinOne(2.7);     // 3
 */
const roundMinOne = (value: number): number => Math.max(1, Math.round(value));

/**
 * Recalculates a specific addon rule and updates its parent addon totals.
 *
 * Uses the current rule parameters and `quantity_parent` to recompute:
 * - `show_count_for_rule`
 * - `max_free_for_rule`
 *
 * Then calls `recalculateQuantityAddon()` to update global addon totals
 * like `quantity_in_cart` and `max_free_quantity`.
 *
 * ---
 *
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
const updateRuleAndAddon: UpdateRuleAndAddonFn = (rule, addon): void => {
  const { quantity_parent, base_count, divisor, show_count_percent } = rule;
  const { max_free, show_count } = calculateQuantity(quantity_parent, base_count, divisor, show_count_percent);

  rule.show_count_for_rule = show_count;
  rule.max_free_for_rule = max_free;

  recalculateQuantityAddon(addon);
};

/**
 * Recalculates the total visible and free quantity for an addon based on all attached rules.
 *
 * Iterates over all `addon_rules` to compute:
 * - `quantity_in_cart`: sum of all `show_count_for_rule`
 * - `max_free_quantity`: sum of all `max_free_for_rule`
 *
 * If `is_user_modified` is `false`, `quantity_in_cart` will be updated automatically.
 *
 * ---
 *
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
export const recalculateQuantityAddon: RecalculateQuantityAddonFn = (addon): void => {
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

/**
 * Adds a new addon entry to the cart state along with its initial rule.
 *
 * The rule is used to calculate:
 * - `max_free_for_rule`: how many free units are allowed
 * - `show_count_for_rule`: how many units should be visible by default
 * Based on that, the addon is created with an initial `quantity_in_cart`.
 *
 * ---
 *
 * Добавляет новую запись о добавке в состояние корзины с первым правилом.
 *
 * Правило используется для расчёта:
 * - `max_free_for_rule`: сколько бесплатных добавок разрешено
 * - `show_count_for_rule`: сколько добавок показать пользователю
 *
 * На основе этих значений создаётся новая добавка с начальным количеством.
 *
 * @param state Redux-контейнер состояния корзины (Immer draft)
 * @param addon_product Продукт-добавка, который будет добавлен
 * @param rule Параметры применяемого правила добавки
 * @param quantity_parent Количество родительского товара в корзине
 *
 * @example
 * addAddonInState(state, {
 *   id: 123, title: 'Соус', price: 30, quantity: 1, ...
 * }, {
 *   addon_rule_id: 5,
 *   base_count: 1,
 *   divisor: 1,
 *   show_count_percent: 100
 * }, 2);
 *
 * @returns void
 */
export const addAddonInState: AddAddonInStateFn = (state, addon_product, rule, quantity_parent): void => {
  const { addon_rule_id, base_count, divisor, show_count_percent } = rule;
  const { max_free, show_count } = calculateQuantity(quantity_parent, base_count, divisor, show_count_percent);

  state.addons[addon_product.id] = {
    addon_product,
    addon_rules: {
      [addon_rule_id]: {
        addon_rule_id,
        base_count,
        divisor,
        show_count_percent,
        quantity_parent,
        max_free_for_rule: max_free,
        show_count_for_rule: show_count,
      },
    },
    quantity_in_cart: roundMinOne(show_count),
    max_free_quantity: roundMinOne(max_free),
    is_user_modified: false,
  };
};

/**
 * Adds a new addon rule to an existing addon in the cart state.
 *
 * The rule is calculated using `quantity_parent` and parameters from `rule`,
 * resulting in `max_free_for_rule` and `show_count_for_rule`.
 * After insertion, the addon totals are updated via `recalculateQuantityAddon()`.
 *
 * ---
 *
 * Добавляет новое правило добавки в уже существующую добавку в состоянии корзины.
 *
 * На основе `quantity_parent` и параметров правила вычисляются:
 * - `max_free_for_rule` — максимально допустимое количество бесплатных добавок
 * - `show_count_for_rule` — количество, отображаемое пользователю
 *
 * После добавления правило пересчитывается и обновляется вся добавка.
 *
 * @param state Состояние корзины (Immer draft)
 * @param addon_product_id ID добавки, к которой добавляется правило
 * @param rule Параметры нового правила
 * @param quantity_parent Количество родительского товара в корзине
 *
 * @returns void
 *
 * @example
 * addRuleInAddon(state, 456, {
 *   addon_rule_id: 7,
 *   base_count: 1,
 *   divisor: 1,
 *   show_count_percent: 100
 * }, 3);
 */
export const addRuleInAddon: AddRuleInAddonFn = (state, addon_product_id, rule, quantity_parent): void => {
  const { addon_rule_id, base_count, divisor, show_count_percent } = rule;
  const { max_free, show_count } = calculateQuantity(quantity_parent, base_count, divisor, show_count_percent);

  const addon = state.addons[addon_product_id];
  addon.addon_rules[addon_rule_id] = {
    addon_rule_id,
    base_count,
    divisor,
    show_count_percent,
    quantity_parent,
    max_free_for_rule: max_free,
    show_count_for_rule: show_count,
  };

  recalculateQuantityAddon(addon);
};

/**
 * Updates an existing addon rule with new parent quantity and recalculates totals.
 *
 * Increases `quantity_parent` for the given rule,
 * then recalculates `max_free_for_rule` and `show_count_for_rule` using `calculateQuantity`.
 * Finally, calls `recalculateQuantityAddon()` to update the overall addon state.
 *
 * ---
 *
 * Обновляет существующее правило добавки при увеличении количества родительского товара.
 *
 * Увеличивает `quantity_parent` и заново рассчитывает:
 * - `max_free_for_rule` — максимально допустимое количество бесплатных добавок
 * - `show_count_for_rule` — сколько добавок должно отображаться
 *
 * После этого обновляется общее состояние добавки.
 *
 * @param state Состояние корзины (Immer draft)
 * @param addon_product_id ID добавки, содержащей обновляемое правило
 * @param addon_rule_id ID правила, которое нужно обновить
 * @param quantity_parent Дополнительное количество родительского товара
 *
 * @returns void
 *
 * @example
 * updateAddonInState(state, 123, 7, 2);
 */
export const updateAddonInState: UpdateAddonInStateFn = (
  state,
  addon_product_id,
  addon_rule_id,
  quantity_parent,
): void => {
  const addon = state.addons[addon_product_id];
  const rule = addon.addon_rules[addon_rule_id];

  rule.quantity_parent += quantity_parent;
  const { base_count, divisor, show_count_percent } = rule;

  const { max_free, show_count } = calculateQuantity(rule.quantity_parent, base_count, divisor, show_count_percent);

  rule.show_count_for_rule = show_count;
  rule.max_free_for_rule = max_free;

  recalculateQuantityAddon(addon);
};

/**
 * Adds or updates all addon entries related to a product in the cart state.
 *
 * Iterates over the product's addon rules and processes each addon product:
 * - If the addon does not exist, creates it with `addAddonInState`
 * - If the addon exists but lacks the rule, adds the rule with `addRuleInAddon`
 * - If both exist, updates the rule via `updateAddonInState`
 *
 * If the addon was temporarily stored in `state.items` (user manually added it),
 * the quantity is preserved and the flag `is_user_modified` is set to `true`.
 *
 * ---
 *
 * Добавляет или обновляет все добавки, связанные с товаром в корзине.
 *
 * Обходит все правила добавок для товара и:
 * - Если добавка не существует — создаёт через `addAddonInState`
 * - Если добавка есть, но правило отсутствует — добавляет через `addRuleInAddon`
 * - Если всё уже есть — обновляет правило через `updateAddonInState`
 *
 * Если пользователь ранее вручную добавил эту добавку (через `state.items`),
 * переносит её количество и помечает как `is_user_modified = true`.
 *
 * @param state Состояние корзины (Immer draft)
 * @param product Товар, к которому применяются правила добавок
 *
 * @returns void
 *
 * @example
 * upsertAddonForProduct(state, state.items[101]);
 */
export const upsertAddonForProduct: UpsertAddonForProductFn = (state, product): void => {
  const { addons = [], quantity: quantity_parent } = product;

  for (const rule of addons) {
    const { addon_rule_id } = rule;

    for (const addon_product of rule.addon_products) {
      const addon_product_id = addon_product.id;
      const existingAddon = state.addons[addon_product_id];

      if (!existingAddon) {
        addAddonInState(state, addon_product, rule, quantity_parent);

        if (state.items[addon_product_id]) {
          state.addons[addon_product_id].quantity_in_cart = state.items[addon_product_id].quantity_in_cart;
          state.addons[addon_product_id].is_user_modified = true;
          delete state.items[addon_product_id];
        }
        continue;
      }

      if (existingAddon.addon_rules[addon_rule_id]) {
        updateAddonInState(state, addon_product_id, addon_rule_id, quantity_parent);
      } else {
        addRuleInAddon(state, addon_product_id, rule, quantity_parent);
      }
    }
  }
};

/**
 * Removes or updates addon rules that were applied by a specific parent product.
 *
 * For each addon rule linked to the product:
 * - If `quantity_parent > 0`, it is reduced and the rule is updated
 * - If the rule was applied only by this product — it is removed
 * - If no rules remain for the addon:
 *   - The addon is deleted if user didn't modify it
 *   - Otherwise it's moved to `items` with preserved quantity
 *
 * This is used when a product is removed or its quantity is decreased.
 *
 * ---
 *
 * Удаляет или обновляет правила добавок, которые были привязаны к родительскому товару.
 *
 * Для каждой добавки и правила:
 * - Если `quantity_parent > 0`, уменьшается и происходит пересчёт
 * - Если правило принадлежало только этому товару — удаляется
 * - Если у добавки не осталось правил:
 *   - Удаляется из состояния, если пользователь не менял количество
 *   - Иначе переносится в `state.items` с сохранённым количеством
 *
 * Используется при удалении товара из корзины или уменьшении его количества.
 *
 * @param state Состояние корзины (Immer draft)
 * @param product_id ID родительского товара, добавки которого нужно очистить
 *
 * @returns void
 *
 * @example
 * pruneAddonsForParent(state, 101);
 */
export const pruneAddonsForParent: PruneAddonsForParentFn = (state, product_id): void => {
  const product = state.items[product_id];
  if (!product) return;

  const quantity_parent = product.quantity;
  const addons = product.addons ?? [];

  for (const rule of addons) {
    const { addon_rule_id } = rule;

    for (const addon of rule.addon_products) {
      const addon_product_id = addon.id;
      const addon_entry = state.addons[addon_product_id];
      if (!addon_entry) continue;

      const rule_entry = addon_entry.addon_rules[addon_rule_id];
      if (!rule_entry) continue;

      if (rule_entry.quantity_parent > quantity_parent) {
        rule_entry.quantity_parent -= quantity_parent;
        updateRuleAndAddon(rule_entry, addon_entry);
        continue;
      }

      delete addon_entry.addon_rules[addon_rule_id];

      if (Object.keys(addon_entry.addon_rules).length > 0) {
        recalculateQuantityAddon(addon_entry);
        continue;
      }

      const shouldDelete = addon_entry.quantity_in_cart === 1 && !addon_entry.is_user_modified;

      if (shouldDelete) {
        delete state.addons[addon_product_id];
      } else {
        state.items[addon_product_id] = {
          ...addon_entry.addon_product,
          quantity_in_cart: addon_entry.quantity_in_cart,
        };
        delete state.addons[addon_product_id];
      }
    }
  }
};
