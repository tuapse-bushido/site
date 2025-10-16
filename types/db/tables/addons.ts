import { z } from 'zod';

/**
 * Zod schema for an addon rule.
 *
 * Fields:
 * - id (number): Unique identifier of the addon rule.
 * - title (string): Display name of the addon rule.
 * - base_count (number): Base number of free addons (non-negative).
 * - divisor (number): Quantity divisor to scale free addons (non-negative).
 * - show_count_percent (number): Percentage of visible addons calculated from base (non-negative).
 * - is_active (boolean): Whether the rule is currently active.
 * - addon_group_id (number | null): Optional reference to an addon group.
 *
 * ---
 * Схема Zod для правила добавок.
 *
 * Поля:
 * - id (number): Уникальный идентификатор правила.
 * - title (string): Название правила.
 * - base_count (number): Базовое количество бесплатных добавок (неотрицательное число).
 * - divisor (number): Делитель количества товара для масштабирования (неотрицательное число).
 * - show_count_percent (number): Процент отображаемых добавок от базового количества (неотрицательное число).
 * - is_active (boolean): Признак активности правила.
 * - addon_group_id (number | null): ID группы добавок (если применимо).
 */
export const addonRuleSchema = z.object({
  id: z.number(),
  title: z.string(),
  base_count: z.number().nonnegative(),
  divisor: z.number().nonnegative(),
  show_count_percent: z.number().nonnegative(),
  is_active: z.boolean(),
});
/**
 * Inferred TypeScript type for an addon rule, based on `addonRuleSchema`.
 *
 * ---
 * Тип правила добавок, выведенный из схемы `addonRuleSchema`.
 */
export type AddonRule = z.infer<typeof addonRuleSchema>;

export const addonSchema = z.object({
  id: z.number(),
  addon_rule_id: z.number(),
  product_id: z.number(),
});
export const addonArraySchema = z.array(addonSchema);

export const addonRuleToProductSchema = z.object({
  addon_rule_id: z.number(),
  product_id: z.number(),
});
export const addonRuleToProductArraySchema = z.array(addonRuleToProductSchema);
export const addonRuleToCategorySchema = z.object({
  addon_rule_id: z.number(),
  category_id: z.number(),
});
export const addonRuleToCategoryArraySchema = z.array(addonRuleToCategorySchema);

const addonProductSchema = z.object({
  addon_product_id: z.number(),
  addon_product_title: z.string(),
});

const attachedProductSchema = z.object({
  product_id: z.number(),
  product_title: z.string(),
});
export type AttachedProduct = z.infer<typeof attachedProductSchema>;

const attachedCategorySchema = z.object({
  category_id: z.number(),
  category_title: z.string(),
});
export type AttachedCategory = z.infer<typeof attachedCategorySchema>;

export const addonRuleFullSchema = addonRuleSchema.extend({
  addon_products: z.array(addonProductSchema),
  attached_products: z.array(attachedProductSchema),
  attached_categories: z.array(attachedCategorySchema),
});
export const addonRuleFullArraySchema = z.array(addonRuleFullSchema);
export type AddonRuleFull = z.infer<typeof addonRuleFullSchema>;
