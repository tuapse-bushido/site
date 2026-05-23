import { z } from 'zod';
import { imageFileSchema } from 'modules/admin/shared/utils/validators.schema';

const baseCategorySchema = z.object({
  id: z.coerce.number().int().positive('Некорректный ID'),

  title: z
    .string()
    .trim()
    .toLowerCase()
    .transform((val): string => val.replace(/\s+/g, ' '))
    .pipe(z.string().min(1, 'Укажите название ингредиента').max(50, 'Название слишком длинное (макс. 50 символов)')),

  is_active: z.boolean(),
  slug: z.string().trim(),
  image_link: z.string().trim().default('no-image.png'),
  sort_number: z.number().default(0),
});

const formCategorySchema = baseCategorySchema.omit({ image_link: true }).extend({
  image_file: imageFileSchema,
  current_image: z.string().trim(),

  is_active: z
    .string()
    .trim()
    .refine((v): boolean => v === 'true' || v === 'false', 'Статус должен быть: Активно или Неактивно')
    .transform((v): boolean => v === 'true'),

  sort_number: z
    .string()
    .trim()
    .regex(/^\d*$/, 'Значение должно быть числом')
    .transform((v): number => Number(v || 0)),
});

export const categorySchemas = {
  base: baseCategorySchema,
  arraySchema: z.array(baseCategorySchema),
  create: baseCategorySchema.omit({ id: true }),
  update: baseCategorySchema,
  delete: '',
  upsert: baseCategorySchema.partial({ id: true }),
  form: {
    create: formCategorySchema.omit({ id: true }),
    update: formCategorySchema.partial({ id: true }),
  },
};

export type Category = z.infer<typeof baseCategorySchema>;
export type InsertCategory = z.infer<typeof categorySchemas.create>;
export type UpsertCategory = z.infer<typeof categorySchemas.upsert>;

export type UpsertFormCategory = z.infer<typeof categorySchemas.form.update>;
