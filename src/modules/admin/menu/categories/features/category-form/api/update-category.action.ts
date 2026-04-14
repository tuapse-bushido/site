'use server';

import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { updateTag } from 'next/cache';
import { formError, parsedFormData } from 'modules/admin/shared/utils/form.utils';
import { uploadImage } from 'modules/admin/shared/api/upload-image';
import { transliterate } from 'modules/admin/shared/utils/transliterate.utils';
import { categoryFormSchema, CategoryFormType, updateCategoryById } from 'modules/admin/menu/categories';

export const updateCategoryAction = async (
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<CategoryFormType>> => {
  const parsed = parsedFormData(formData, categoryFormSchema);

  if (!parsed.success) return formError({ fieldErrors: parsed.fieldErrors });

  const { id, image_file, current_image, sort_number: sortNumber, slug: href, title } = parsed.data;

  const image_link = image_file ? await uploadImage(image_file, title, 'categories') : current_image;
  const sort_number = sortNumber ?? 0;
  const slug = href ?? transliterate(title);

  const category = {
    ...parsed.data,
    image_link,
    sort_number,
    slug,
  };

  const response = await updateCategoryById(category);

  if (!response.ok) return formError({ message: response.message });

  updateTag('categories');
  updateTag(`category-${id}`);
  redirect('/admin/menu/categories');
};
