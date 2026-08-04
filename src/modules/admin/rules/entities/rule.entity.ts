import { z } from 'zod';
import { Category } from 'modules/admin/menu/categories/entities';
import { Product } from 'modules/admin/menu/products/entities';

export const addonRuleSchema = z.object({
  id: z.number(),
  title: z.string(),
  base_count: z.number(),
  divisor: z.number(),
  show_count_percent: z.number(),
  is_active: z.boolean(),
});

export type AddonRule = z.infer<typeof addonRuleSchema>;
export type InsertAddonRule = Omit<AddonRule, 'id'>;

const idTitleSchema = z.object({
  id: z.number(),
  title: z.string(),
});

export const addonRuleDetailSchema = addonRuleSchema.extend({
  addons: z.array(idTitleSchema),
  categories: z.array(idTitleSchema),
  products: z.array(idTitleSchema),
});
export const arrayAddonRuleDetailSchema = z.array(addonRuleDetailSchema);

export type AddonRuleDetail = z.infer<typeof addonRuleDetailSchema>;

export type AddonRuleEditData = {
  addonRule: AddonRuleDetail | undefined;
  categories: Category[];
  products: Product[];
};
