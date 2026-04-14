import { z } from 'zod';

const addonSchema = z.object({
  id: z.number(),
  addon_rule_id: z.number(),
  product_id: z.number(),
});
export const arrayAddonsSchema = z.array(addonSchema);

export const ruleToCategorySchema = z.object({
  addon_rule_id: z.number(),
  category_id: z.number(),
});
export const arrayRuleToCategorySchema = z.array(ruleToCategorySchema);

export const ruleToProductSchema = z.object({
  addon_rule_id: z.number(),
  product_id: z.number(),
});

export const arrayRuleToProductSchema = z.array(ruleToProductSchema);

export type Addon = z.infer<typeof addonSchema>;
export type RuleToCategory = z.infer<typeof ruleToCategorySchema>;
export type RuleToProduct = z.infer<typeof ruleToProductSchema>;
