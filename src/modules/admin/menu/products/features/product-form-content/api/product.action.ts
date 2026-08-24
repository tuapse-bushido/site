'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { uploadImage } from 'modules/admin/shared/api/upload-image';
import { productCases } from 'modules/admin/menu/products/use-cases';
import { transliterate } from 'modules/admin/shared/utils/transliterate.utils';
import { formErrorNew, parsedFormDataNew } from 'modules/admin/shared/utils/form.utils';
import { productSchemas as schemas, UpsertProduct, UpsertProductForm } from 'modules/admin/menu/products/entities';

export const upsertProductAction = async (
  productId: number | null,
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<UpsertProductForm>> => {
  const { schema, extraData } =
    productId !== null
      ? { schema: schemas.form.update, extraData: { id: productId } }
      : { schema: schemas.form.create, extraData: {} };

  const parsed = parsedFormDataNew(formData, schema, extraData);
  if (!parsed.success) return formErrorNew({ fieldErrors: parsed.fieldErrors, data: parsed.data });

  const { image_file, current_image, title, slug } = parsed.data;
  const { ingredients, categories, set_items } = parsed.data;

  const productDto: UpsertProduct = {
    ...(productId !== null ? { id: productId } : {}),
    title,
    slug: slug === '' ? transliterate(title) : slug,
    image_link: image_file && image_file.size > 0 ? await uploadImage(image_file, title, 'products') : current_image,
    is_visible: parsed.data.is_visible,
    is_set: parsed.data.is_set,
    is_active: parsed.data.is_active,
    price: parsed.data.price,
    weight: parsed.data.weight,
    count_portion: parsed.data.count_portion,
    quantity: parsed.data.quantity,
  };

  const response = await productCases.upsertProductCase(
    productDto,
    ingredients,
    categories,
    set_items,
    productId !== null ? 'update' : 'insert',
  );

  if (!response.ok) {
    return formErrorNew({
      code: response.code,
      options: response.options,
      data: parsed.data,
    });
  }

  updateTag('products');
  updateTag('home');
  redirect('/admin/menu/products');
};

export const deleteProductAction = async (productId: number): Promise<FormState<null>> => {
  const response = await productCases.deleteProductCase(productId);

  if (!response.ok) {
    return formErrorNew({
      code: response.code,
      options: response.options,
    });
  }

  updateTag('products');
  updateTag('home');
  redirect('/admin/menu/products');
};
