'use server';

import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { uploadImage } from 'modules/admin/shared/api/upload-image';
import { categoryCases } from 'modules/admin/menu/categories/use-cases';
import { categoryService } from 'modules/admin/menu/categories/services';
import { transliterate } from 'modules/admin/shared/utils/transliterate.utils';
import { formErrorNew, parsedFormDataNew } from 'modules/admin/shared/utils/form.utils';
import { invalidateCategoryCache } from 'modules/admin/shared/utils/cache-invalidation.utils';
import { categorySchemas as schemas, UpsertFormCategory } from 'modules/admin/menu/categories/entities';

export const upsertCategoryAction = async (
  categoryId: number | null,
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<UpsertFormCategory>> => {
  const { schema, extraData } = categoryId
    ? { schema: schemas.form.update, extraData: { id: categoryId } }
    : { schema: schemas.form.create, extraData: {} };

  const parsed = parsedFormDataNew(formData, schema, extraData);
  if (!parsed.success) return formErrorNew({ fieldErrors: parsed.fieldErrors });

  const { image_file, current_image, title, slug, ...restData } = parsed.data;

  const dto = {
    ...restData,
    title,
    slug: slug === '' ? transliterate(title) : slug,
    image_link: image_file && image_file.size > 0 ? await uploadImage(image_file, title, 'categories') : current_image,
  };

  const response = await categoryCases.upsertCategoryCase(dto, categoryId ? 'update' : 'insert');

  if (!response.ok) {
    return formErrorNew({
      code: response.code,
      options: response.options,
      data: parsed.data,
    });
  }

  invalidateCategoryCache();

  redirect('/admin/menu/categories');
};

export const deleteCategoryAction = async (categoryId: number): Promise<FormState<null>> => {
  const response = await categoryService.syncDeleteCategory(categoryId);

  if (!response.ok) {
    return formErrorNew({
      code: response.code,
      options: response.options,
    });
  }

  invalidateCategoryCache();

  redirect('/admin/menu/categories');
};
