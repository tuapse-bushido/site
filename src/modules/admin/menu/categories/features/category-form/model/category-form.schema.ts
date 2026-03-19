import { z } from 'zod';
import { transliterate } from 'modules/admin/shared/utils/transliterate.utils';
import { imageFileSchema } from 'modules/admin/shared/utils/validators.schema';

export const baseCategorySchema = z.object({
  id: z.coerce.number(),
  title: z.string().trim().min(1, 'Поле обязательно для заполнения').max(30, 'Максимум 30 символов'),
  image_file: imageFileSchema,
  current_image: z.string(),
  is_active: z
    .string()
    .refine((v): boolean => v === 'true' || v === 'false', 'Статус должен быть: Активно или Неактивно')
    .transform((v): boolean => v === 'true'),
  slug: z.string().trim(),
  sort_number: z
    .string()
    .trim()
    .regex(/^\d*$/, 'Значение должно быть числом')
    .transform((v): number => Number(v || 0)),
});

export type CategoryFormType = z.infer<typeof baseCategorySchema>;

export const categoryFormSchema = baseCategorySchema.transform(
  (data): CategoryFormType => ({
    ...data,
    slug: data.slug === '' ? transliterate(data.title) : data.slug,
  }),
);

export const createCategorySchema = baseCategorySchema.omit({ id: true }).transform(
  (data): Omit<CategoryFormType, 'id'> => ({
    ...data,
    slug: data.slug === '' ? transliterate(data.title) : data.slug,
  }),
);
