'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { uploadImage } from 'modules/admin/shared/api/upload-image';
import { formError, parsedFormData } from 'modules/admin/shared/utils/form.utils';
import { CategoryFormType, createCategorySchema, insertCategory } from 'modules/admin/menu/categories';

export const createCategoryAction = async (
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<CategoryFormType>> => {
  const parsed = parsedFormData(formData, createCategorySchema);

  if (!parsed.success) return formError({ fieldErrors: parsed.fieldErrors });

  const { image_file, current_image, sort_number: sortNumber, title } = parsed.data;

  const category = {
    ...parsed.data,
    image_link: image_file ? await uploadImage(image_file, title) : current_image,
    sort_number: sortNumber ?? 0,
  };

  const response = await insertCategory(category);

  if (!response.ok) return formError({ message: response.message });

  updateTag('categories');
  redirect('/admin/menu/categories');
};
