import { Draft } from '@reduxjs/toolkit';
import { AddonEntry, CartItem, CartState } from '@/types';
import { ProductCard } from '@/types/db/composite/product-card';

/**
 * Result of addon quantity calculation based on rule parameters and parent quantity.
 *
 * ---
 * Результат расчёта количества добавок по правилу и количеству родительского товара.
 */
export type QuantityResult = {
  max_free: number;
  show_count: number;
};

/**
 * Parameters describing a rule applied to addon products.
 *
 * ---
 * Параметры правила добавки, применяемого к продуктам-добавкам.
 */
export type RuleParams = {
  addon_rule_id: number;
  base_count: number;
  divisor: number;
  show_count_percent: number;
};

/**
 * Calculates `max_free` and `show_count` for an addon rule.
 *
 * ---
 * Вычисляет `max_free` и `show_count` на основе количества родительского товара и параметров правила.
 *
 * Используется во всех функциях, где нужно пересчитать добавку или правило.
 */
export type CalculateQuantityFn = (
  quantity: number,
  base_count: number,
  divisor: number,
  show_count_percent: number,
) => QuantityResult;

/**
 * Recalculates global addon values like `quantity_in_cart` and `max_free_quantity`.
 *
 * ---
 * Пересчитывает итоговое количество и лимиты добавки на основе всех правил.
 * Не изменяет количество, если пользователь указал его вручную.
 */
export type RecalculateQuantityAddonFn = (addon: AddonEntry) => void;

/**
 * Adds a new rule to an existing addon entry in the cart state.
 *
 * ---
 * Добавляет новое правило к уже существующей добавке в состоянии корзины.
 * После добавления вызывает пересчёт всей добавки.
 */
export type AddRuleInAddonFn = (
  state: Draft<CartState>,
  addon_product_id: number,
  rule: RuleParams,
  quantity_parent: number,
) => void;

/**
 * Updates an existing rule in an addon entry when parent quantity increases.
 *
 * ---
 * Обновляет правило добавки при увеличении количества родительского товара.
 * Изменяет `quantity_parent` и пересчитывает лимиты.
 */
export type UpdateAddonInStateFn = (
  state: Draft<CartState>,
  addon_product_id: number,
  addon_rule_id: number,
  quantity_parent: number,
) => void;

/**
 * Adds a new addon entry with its initial rule to the cart state.
 *
 * ---
 * Добавляет новую запись о добавке в корзину вместе с первым правилом.
 * Используется, если добавка ещё не существует в состоянии.
 */
export type AddAddonInStateFn = (
  state: Draft<CartState>,
  addon_product: ProductCard,
  rule: RuleParams,
  quantity_parent: number,
) => void;

/**
 * Recalculates a single rule and updates the addon it belongs to.
 *
 * ---
 * Перерассчитывает одно конкретное правило и обновляет добавку, к которой оно относится.
 */
export type UpdateRuleAndAddonFn = (rule: AddonEntry['addon_rules'][number], addon: AddonEntry) => void;

/**
 * Adds or updates all addon entries related to the given product.
 *
 * ---
 * Добавляет или обновляет все добавки, связанные с товаром в корзине.
 * Используется при добавлении товара или изменении его количества.
 */
export type UpsertAddonForProductFn = (state: Draft<CartState>, product: CartItem) => void;

/**
 * Removes or adjusts addon rules tied to the given product after removal or quantity change.
 *
 * ---
 * Удаляет или обновляет правила добавок, связанные с товаром, который был удалён или уменьшен.
 * Если у добавки больше нет правил — она удаляется или переносится в основную корзину.
 */
export type PruneAddonsForParentFn = (state: Draft<CartState>, product_id: number) => void;
