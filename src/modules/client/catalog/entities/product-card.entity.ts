import { z } from 'zod';
import { Product, productSchema } from 'shared/entites/product';

export type AddonProduct = Pick<
  Product,
  'id' | 'title' | 'slug' | 'image_link' | 'price' | 'quantity' | 'count_portion' | 'weight'
> & {
  discount_percent: number;
};

export type AddonRuleWithProduct = {
  addon_rule_id: number;
  base_count: number;
  divisor: number;
  show_count_percent: number;
  addon_products: AddonProduct[];
};

export type SetItem = {
  id: number;
  title: string;
  is_active: boolean;
  is_visible: boolean;
  is_set: boolean;
  slug: string;
  image_link: string;
  price: number;
  weight: number;
  count_portion: number;
  quantity: number;
  ingredients: string[];
};

export type ProductCard = Product & {
  ingredients: string[];
  category_ids: number[];
  discount_percent: number;

  addons: AddonRuleWithProduct[];
  set_items: SetItem[];
};

export const setItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  is_active: z.boolean(),
  is_visible: z.boolean(),
  is_set: z.boolean(),
  slug: z.string(),
  image_link: z.string(),
  price: z.coerce.number(),
  weight: z.number(),
  count_portion: z.number().int().min(1),
  quantity: z.number().int().min(1),
  ingredients: z.array(z.string()),
}) satisfies z.ZodType<SetItem>;

export const addonProductSchema = productSchema
  .pick({
    id: true,
    title: true,
    slug: true,
    image_link: true,
    price: true,
    quantity: true,
    count_portion: true,
    weight: true,
  })
  .extend({
    discount_percent: z.number().min(0).max(100),
  }) satisfies z.ZodType<AddonProduct>;

export const addonRuleWithProductSchema = z.object({
  addon_rule_id: z.number(),
  base_count: z.number().nonnegative(),
  divisor: z.number().nonnegative(),
  show_count_percent: z.number().nonnegative(),
  addon_products: z.array(addonProductSchema),
}) satisfies z.ZodType<AddonRuleWithProduct>;

export const productCardSchema = productSchema.extend({
  ingredients: z.array(z.string()),
  category_ids: z.array(z.number().int()),
  discount_percent: z.number().min(0).max(100),
  addons: z.array(addonRuleWithProductSchema),
  set_items: z.array(setItemSchema),
}) satisfies z.ZodType<ProductCard>;
export const arrayProductCardSchema = z.array(productCardSchema);
