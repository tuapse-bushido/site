import { z } from 'zod';

const baseAddonRuleFormSchema = z.object({
  id: z.coerce.number(),

  title: z.string(),

  base_count: z.coerce.number(),
  divisor: z.coerce.number(),
  show_count_percent: z.coerce.number(),

  is_active: z.enum(['true', 'false']).transform((val): boolean => val === 'true'),

  addons: z.array(z.coerce.number()).default([]),
  categories: z.array(z.coerce.number()).default([]),
  products: z.array(z.coerce.number()).default([]),
});

const createAddonRuleFormSchema = baseAddonRuleFormSchema.omit({ id: true });

export const addonRuleFormSchemas = {
  create: createAddonRuleFormSchema,
  update: baseAddonRuleFormSchema,
  delete: baseAddonRuleFormSchema,
};

export type AddonRuleForm = z.infer<typeof baseAddonRuleFormSchema>;
export type UpsertAddonRuleForm = z.infer<typeof createAddonRuleFormSchema> & { id?: number };
