'use server';

import { z } from 'zod';
import { uploadImage } from '@/libs/object-storage/storage';
import { Category } from '@/types';
import { insertCategory, updateCategoryById } from '@/libs/db/category/category.query';
import { ActionResult, transliterate } from '@/utils';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { FormAction } from '@/components/forms/category/ingredient-form.props';

// 1. Улучшенная схема валидации
const formSchema = z.object({
  title: z.string().trim().min(1, 'Название обязательное поле').max(50, 'Название не может превышать 50 символов'),
  image_file: z.instanceof(File),
  slug: z.string().trim().optional(),
  is_active: z.enum(['true', 'false']),
  sort_number: z
    .string()
    .transform((val): number => Number(val))
    .pipe(z.number().int().nonnegative()),
});

// 2. Типы для лучшей читаемости
type CategoryData = {
  title: string;
  image_file: File;
  is_active: boolean;
  sort_number: number;
  slug: string;
};

type ErrorResponse = {
  success: boolean;
  message: string;
};

// 3. Улучшенная функция подготовки данных
const prepareCategoryData = (formData: FormData): CategoryData | ErrorResponse => {
  const formObject = Object.fromEntries(formData.entries());
  const parsed = formSchema.safeParse(formObject);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0].message };
  }

  const slug = parsed.data.slug?.trim() || transliterate(parsed.data.title);

  return {
    ...parsed.data,
    slug,
    is_active: parsed.data.is_active === 'true',
  };
};

// 4. Более надежная обработка изображений
const handleImageUpload = async (imageFile: File, title: string, existingImage?: string | null): Promise<string> => {
  if (imageFile.size === 0 && imageFile.name === 'undefined') {
    return existingImage || 'no_image.png';
  }
  return await uploadImage(imageFile, title);
};

// 5. Общая функция для обработки результата
const handleActionResult = (response: ActionResult<Category>): ErrorResponse => {
  if (!response.success) {
    return {
      success: false,
      message: response.message,
    };
  }

  revalidatePath('/admin/menu/categories');
  redirect('/admin/menu/categories');
};

// 6. Основные функции действий
// export const actionInsertCategory = async (
//   prevState: ErrorResponse,
//   formData: FormData,
// ): Promise<ErrorResponse | void> => {
//   const preparedData = prepareCategoryData(formData);
//
//   if ('message' in preparedData) return preparedData;
//
//   const { title, slug, sort_number, is_active, image_file } = preparedData;
//   const image_link = await handleImageUpload(image_file, title);
//
//   handleActionResult(await insertCategory({ title, slug, image_link, sort_number, is_active }));
// };

export const actionInsertCategory: FormAction<Category> = async (
  prevState,
  formData,
): Promise<ErrorResponse | { message: string; success: boolean }> => {
  const preparedData = prepareCategoryData(formData);

  if ('message' in preparedData) return preparedData;

  const { title, slug, sort_number, is_active, image_file } = preparedData;
  const image_link = await handleImageUpload(image_file, title);

  const result = await insertCategory({ title, slug, image_link, sort_number, is_active });

  if (!result.success) {
    return { message: result.message, success: false };
  }

  return { message: 'Категория добавлена', success: true };
};

// export const actionUpdateCategory = async (
//   prevState: ErrorResponse,
//   formData: FormData,
//   category?: Category,
// ): Promise<ErrorResponse | void> => {
//   const preparedData = prepareCategoryData(formData);
//
//   if ('message' in preparedData) return preparedData;
//   if (!category)
//     return {
//       success: false,
//       message: 'Нет категории',
//     };
//
//   const { title, slug, sort_number, is_active, image_file } = preparedData;
//   const image_link = await handleImageUpload(image_file, title, category.image_link);
//
//   handleActionResult(await updateCategoryById({ id: category.id, title, slug, image_link, sort_number, is_active }));
// };

export const actionUpdateCategory: FormAction<Category> = async (
  prevState,
  formData,
  category,
): Promise<ErrorResponse | { message: string; success: boolean }> => {
  const preparedData = prepareCategoryData(formData);

  // проверка схемы
  if ('message' in preparedData) {
    return { message: preparedData.message, success: false };
  }

  // если категория не передана
  if (!category) {
    return { message: 'Нет категории', success: false };
  }

  const { title, slug, sort_number, is_active, image_file } = preparedData;

  const image_link = await handleImageUpload(image_file, title, category.image_link);

  const result = await updateCategoryById({
    id: category.id,
    title,
    slug,
    image_link,
    sort_number,
    is_active,
  });

  // финальный ответ
  if (!result.success) {
    return { message: result.message, success: false };
  }

  return { message: 'Категория обновлена', success: true };
};
