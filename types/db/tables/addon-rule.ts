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
  addon_group_id: z.number().nullable(),
});

/**
 * Inferred TypeScript type for an addon rule, based on `addonRuleSchema`.
 *
 * ---
 * Тип правила добавок, выведенный из схемы `addonRuleSchema`.
 */
export type AddonRule = z.infer<typeof addonRuleSchema>;
