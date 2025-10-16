'use server';

import { z } from 'zod';
import { Product } from '@/types';
import { uploadImage } from '@/libs/object-storage/storage';
import { ActionResult, transliterate } from '@/utils';
import { insertProduct } from '@/libs/db/product/products.query';
import { insertCategoriesToProduct, insertIngredientsToProduct, insertSetItems } from '@/libs/db/composite/composite';
import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';

function getArrayField(formData: FormData, name: string): string[] {
  return formData.getAll(name).filter((val): val is string => typeof val === 'string' && val.trim() !== '');
}

const productFormSchema = z.object({
  title: z.string().trim().min(1, 'Название обязательное поле').max(50, 'Название не может превышать 50 символов'),
  is_active: z.enum(['true', 'false']),
  is_visible: z.enum(['false', 'true']),
  is_set: z.enum(['false', 'true']),
  slug: z.string().trim().optional(),
  image_file: z.instanceof(File),
  price: z
    .string()
    .transform((val): number => Number(val))
    .pipe(z.number().int().nonnegative()),
  weight: z
    .string()
    .transform((val): number => Number(val))
    .pipe(z.number().int().nonnegative()),
  count_portion: z
    .string()
    .transform((val): number => Number(val))
    .pipe(z.number().int().nonnegative()),
  quantity: z
    .string()
    .transform((val): number => Number(val))
    .pipe(z.number().int().nonnegative()),
});

const productOptionsFormSchema = z.object({
  set_items: z.preprocess(
    (val): [] | unknown[] => (Array.isArray(val) ? val : val ? [val] : []),
    z.array(z.string()).transform((arr): number[] => arr.map(Number)),
  ),
  categories: z.preprocess(
    (val): [] | unknown[] => (Array.isArray(val) ? val : val ? [val] : []),
    z.array(z.string()).transform((arr): number[] => arr.map(Number)),
  ),
  ingredients: z.preprocess(
    (val): [] | unknown[] => (Array.isArray(val) ? val : val ? [val] : []),
    z.array(z.string()).transform((arr): number[] => arr.map(Number)),
  ),
});

export const actionProductInsert = async (
  prev: {
    success: boolean;
    message: string;
  } | null,
  formData: FormData,
): Promise<{ success: boolean; message: string }> => {
  const formObject = Object.fromEntries(formData.entries());
  const formProduct = {
    title: formObject.title,
    is_active: formObject.is_active,
    is_visible: formObject.is_visible,
    is_set: formObject.is_set,
    slug: formObject.slug,
    image_file: formObject.image_file,
    price: formObject.price,
    weight: formObject.weight,
    count_portion: formObject.count_portion,
    quantity: formObject.quantity,
  };
  const formOptions = {
    categories: getArrayField(formData, 'categories'),
    ingredients: getArrayField(formData, 'ingredients'),
    set_items: getArrayField(formData, 'set'),
  };

  const parsedProduct = productFormSchema.safeParse(formProduct);
  const parsedOptionsProduct = productOptionsFormSchema.safeParse(formOptions);

  if (!parsedProduct.success || !parsedOptionsProduct.success) {
    const message =
      parsedProduct.error?.issues[0].message ?? parsedOptionsProduct.error?.issues[0].message ?? 'Ошибка валидации';
    return { success: false, message: message };
  }

  const { title, is_active, image_file, is_set, count_portion, quantity, price, weight, is_visible, slug } =
    parsedProduct.data;

  const image_link =
    image_file.size === 0 && image_file.name === 'undefined' ? 'no_image.png' : await uploadImage(image_file, title);

  const product: Omit<Product, 'id'> = {
    title,
    is_active: is_active === 'true',
    is_set: is_set === 'true',
    is_visible: is_visible === 'true',
    count_portion,
    quantity,
    price,
    weight,
    slug: slug ? slug.trim() : transliterate(title),
    image_link,
  };

  const responseProduct = await insertProduct(product);

  if (!responseProduct.success)
    return {
      success: false,
      message: responseProduct.message,
    };

  const insertPromises = Object.entries(parsedOptionsProduct.data)
    .filter(([_, values]): boolean => values.length > 0)
    .map(([key, values]): Promise<ActionResult<unknown>> => {
      if (key === 'set_items') return insertSetItems(responseProduct.data.id, values);
      if (key === 'ingredients') return insertIngredientsToProduct(responseProduct.data.id, values);
      if (key === 'categories') return insertCategoriesToProduct(responseProduct.data.id, values);

      throw new Error(`Unexpected key: ${key}`);
    });

  const results = await Promise.all(insertPromises);

  for (const result of results) {
    if (!result.success) {
      return {
        success: false,
        message: result.message,
      };
    }
  }

  revalidatePath('/');
  revalidatePath('/admin/menu/products');
  revalidateTag('productCard');
  redirect('/admin/menu/products');
};
