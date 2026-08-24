import { z } from 'zod';
import { Category } from 'shared/entites/category';
import { Product } from 'modules/admin/menu/products/entities';
import { booleanSchemaFromLabels, stringToArrayNumberSchema } from 'modules/admin/shared/utils/validators.schema';

const baseAddonRuleSchema = z.object({
  id: z.coerce.number().int().positive('Некорректный ID'),
  title: z
    .string()
    .trim()
    .toLowerCase()
    .transform((val): string => val.replace(/\s+/g, ' '))
    .pipe(z.string().min(1, 'Укажите название правила').max(50, 'Название слишком длинное (макс. 50 символов)')),

  base_count: z.coerce.number().int().positive('Должно быть положительным число > 0').default(1),
  divisor: z.coerce.number().int().positive('Должно быть положительным число > 0').default(1),

  show_count_percent: z.coerce
    .number()
    .int()
    .positive('Должно быть положительным число > 0 и < 100')
    .max(100, 'Значение должно быть от 1 до 100')
    .default(50),

  is_active: z.boolean(),
});

// RELATIONS
const addonRuleAddonProductRelationSchema = z.object({
  addon_rule_id: z.number(),
  product_id: z.number(),
});

const addonRuleTargetCategoryRelationSchema = z.object({
  addon_rule_id: z.number(),
  category_id: z.number(),
});

const addonRuleTargetProductRelationSchema = z.object({
  addon_rule_id: z.number(),
  product_id: z.number(),
});

// ----------------------------------------

const idTitleSchema = z.object({
  id: z.coerce.number(),
  title: z.string(),
});

const addonRuleDetailSchema = baseAddonRuleSchema.extend({
  addons: z.array(idTitleSchema),
  products: z.array(idTitleSchema),
  categories: z.array(idTitleSchema),
});

const addonRuleFormSchema = baseAddonRuleSchema.extend({
  is_active: booleanSchemaFromLabels({
    true: 'Активно',
    false: 'Неактивно',
  }),

  addons: stringToArrayNumberSchema,
  products: stringToArrayNumberSchema,
  categories: stringToArrayNumberSchema,
});

export const addonRuleSchemas = {
  base: baseAddonRuleSchema,
  array: z.array(baseAddonRuleSchema),
  details: addonRuleDetailSchema,
  insert: baseAddonRuleSchema.omit({ id: true }),
  upsert: baseAddonRuleSchema.partial({ id: true }),
  form: {
    create: addonRuleFormSchema.omit({ id: true }),
    update: addonRuleFormSchema,
  },

  relations: {
    addonProducts: {
      base: addonRuleAddonProductRelationSchema,
      array: z.array(addonRuleAddonProductRelationSchema),
    },
    targetCategories: {
      base: addonRuleTargetCategoryRelationSchema,
      array: z.array(addonRuleTargetCategoryRelationSchema),
    },
    targetProducts: {
      base: addonRuleTargetProductRelationSchema,
      array: z.array(addonRuleTargetProductRelationSchema),
    },
  },
};

export type AddonRule = z.infer<typeof addonRuleSchemas.base>;
export type AddonRuleWithDetails = z.infer<typeof addonRuleSchemas.details>;
export type AddonRuleEditData = {
  addonRule?: AddonRuleWithDetails;
  categories: Category[];
  products: Product[];
};

export type InsertAddonRule = z.infer<typeof addonRuleSchemas.insert>;
export type UpsertAddonRule = z.infer<typeof addonRuleSchemas.upsert>;

export type AddonRuleAddonProductRelation = z.infer<typeof addonRuleSchemas.relations.addonProducts.base>;
export type AddonRuleTargetProductRelation = z.infer<typeof addonRuleSchemas.relations.targetProducts.base>;
export type AddonRuleTargetCategoryRelation = z.infer<typeof addonRuleSchemas.relations.targetCategories.base>;

export type UpsertFormAddonRule = z.infer<typeof addonRuleSchemas.form.create> & {
  id?: number;
};
