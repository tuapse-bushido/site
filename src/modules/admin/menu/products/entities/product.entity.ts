import { z } from 'zod';
import { Ingredient } from 'modules/admin/menu/ingredients/entities';
import { Category } from 'shared/entites/category';
import {
  booleanSchemaFromLabels,
  imageFileSchema,
  nonNegativeNumberSchema,
  stringToArrayNumberSchema,
} from 'modules/admin/shared/utils/validators.schema';

const baseProductSchema = z.object({
  id: z.coerce.number().int().positive('Некорректный ID'),

  title: z
    .string()
    .trim()
    .toLowerCase()
    .transform((val): string => val.replace(/\s+/g, ' '))
    .pipe(z.string().min(1, 'Укажите название продукта').max(50, 'Название слишком длинное (макс. 50 символов)')),

  is_active: z.boolean(),
  is_visible: z.boolean(),
  is_set: z.boolean(),

  slug: z.string(),
  image_link: z.string().trim().default('no-image.png'),
  price: z.coerce.number(),
  weight: z.coerce.number(),
  count_portion: z.coerce.number(),
  quantity: z.coerce.number(),
});

const idTitleSchema = z.object({
  id: z.number(),
  title: z.string(),
});

const productWithDetailSchema = baseProductSchema.extend({
  ingredients: z.array(idTitleSchema),
  categories: z.array(idTitleSchema),
  set_items: z.array(idTitleSchema),
});

const productFormSchema = productWithDetailSchema.omit({ image_link: true }).extend({
  image_file: imageFileSchema,
  current_image: z.string().trim(),

  is_active: booleanSchemaFromLabels({
    true: 'Активно',
    false: 'Неактивно',
  }),
  is_visible: booleanSchemaFromLabels({
    true: 'Видим',
    false: 'Скрыт',
  }),
  is_set: booleanSchemaFromLabels({
    true: 'Сет',
    false: 'Блюдо',
  }),

  slug: z.string().trim(),

  price: nonNegativeNumberSchema,
  weight: nonNegativeNumberSchema,
  count_portion: nonNegativeNumberSchema,
  quantity: nonNegativeNumberSchema,

  ingredients: stringToArrayNumberSchema,
  categories: stringToArrayNumberSchema,
  set_items: stringToArrayNumberSchema,
});

// RELATIONS
const productIngredientSchema = z.object({
  product_id: z.number(),
  ingredient_id: z.number(),
});

const productCategorySchema = z.object({
  product_id: z.number(),
  category_id: z.number(),
});

const productSetItemSchema = z.object({
  set_product_id: z.number(),
  product_id: z.number(),
});

export const productSchemas = {
  base: baseProductSchema,
  array: z.array(baseProductSchema),
  details: productWithDetailSchema,
  insert: baseProductSchema.omit({ id: true }),
  upsert: baseProductSchema.partial({ id: true }),
  form: {
    create: productFormSchema.omit({ id: true }),
    update: productFormSchema.partial({ id: true }),
  },
  relations: {
    ingredients: {
      base: productIngredientSchema,
      array: z.array(productIngredientSchema),
    },
    categories: {
      base: productCategorySchema,
      array: z.array(productCategorySchema),
    },
    set_items: {
      base: productSetItemSchema,
      array: z.array(productSetItemSchema),
    },
  },
};

export type Product = z.infer<typeof productSchemas.base>;
export type ProductWithDetails = z.infer<typeof productSchemas.details>;
export type ProductEditData = {
  product?: ProductWithDetails;
  ingredients: Ingredient[];
  categories: Category[];
  products: Product[];
};

export type InsertProduct = z.infer<typeof productSchemas.insert>;
export type UpsertProduct = z.infer<typeof productSchemas.upsert>;

export type UpsertProductForm = z.infer<typeof productSchemas.form.update>;

export type ProductIngredientRelation = z.infer<typeof productSchemas.relations.ingredients.base>;
export type ProductCategoryRelation = z.infer<typeof productSchemas.relations.categories.base>;
export type ProductSetItemRelation = z.infer<typeof productSchemas.relations.set_items.base>;
