import { Draft } from '@reduxjs/toolkit';
import { mapAddonToCartItem } from './cart-mapper';
import { AddonProduct } from 'modules/client/entities';
import { CartItem, CartState } from './cart-state.types';
import { calculateQuantity, roundMinOne } from './cart-calculations';
import { recalculateQuantityAddon, updateRuleAndAddon } from './cart-rules';

/**
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
export const upsertAddonForProduct = (state: Draft<CartState>, product: CartItem): void => {
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
export const pruneAddonsForParent = (state: Draft<CartState>, product_id: number): void => {
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
        state.items[addon_product_id] = mapAddonToCartItem(addon_entry.addon_product, addon_entry.quantity_in_cart);
        delete state.addons[addon_product_id];
      }
    }
  }
};

/**
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
export const addAddonInState = (
  state: Draft<CartState>,
  addon_product: AddonProduct,
  rule: {
    addon_rule_id: number;
    base_count: number;
    divisor: number;
    show_count_percent: number;
  },
  quantity_parent: number,
): void => {
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
export const addRuleInAddon = (
  state: Draft<CartState>,
  addon_product_id: number,
  rule: {
    addon_rule_id: number;
    base_count: number;
    divisor: number;
    show_count_percent: number;
  },
  quantity_parent: number,
): void => {
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
export const updateAddonInState = (
  state: Draft<CartState>,
  addon_product_id: number,
  addon_rule_id: number,
  quantity_parent: number,
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
