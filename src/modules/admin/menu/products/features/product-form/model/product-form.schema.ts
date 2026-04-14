import { z } from 'zod';
import {
  booleanSchemaFromLabels,
  imageFileSchema,
  nonNegativeNumberSchema,
  stringToArrayNumberSchema,
} from 'modules/admin/shared/utils/validators.schema';
import { transliterate } from 'modules/admin/shared/utils/transliterate.utils';
import { productWithDetailSchema } from 'modules/admin/menu/products/entities';

export const baseProductFormSchema = productWithDetailSchema.omit({ set_items: true }).extend({
  id: z.coerce.number().optional(),
  title: z.string().trim().min(1, 'Поле обязательно для заполнения').max(30, 'Максимум 30 символов'),

  image_link: z.string().optional(),
  image_file: imageFileSchema,
  current_image: z.string(),

  is_active: booleanSchemaFromLabels({ true: 'Активно', false: 'Неактивно' }),
  is_visible: booleanSchemaFromLabels({ true: 'Видим', false: 'Скрыт' }),
  is_set: booleanSchemaFromLabels({ true: 'Сет', false: 'Блюдо' }),

  slug: z.string().trim(),

  price: nonNegativeNumberSchema,
  weight: nonNegativeNumberSchema,
  count_portion: nonNegativeNumberSchema,
  quantity: nonNegativeNumberSchema,

  ingredients: stringToArrayNumberSchema,
  categories: stringToArrayNumberSchema,
  set_items: stringToArrayNumberSchema,
});

export type ProductFormType = z.infer<typeof baseProductFormSchema>;

export const productFormSchema = baseProductFormSchema.transform(
  (data): ProductFormType => ({
    ...data,
    slug: data.slug === '' ? transliterate(data.title) : data.slug,
  }),
);
export type ProductForm = z.infer<typeof productFormSchema>;

export const createProductSchema = baseProductFormSchema.omit({ id: true }).transform(
  (data): Omit<ProductFormType, 'id'> => ({
    ...data,
    slug: data.slug === '' ? transliterate(data.title) : data.slug,
  }),
);
export type CreateProductForm = z.infer<typeof productFormSchema>;
