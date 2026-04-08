'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { createProductSchema, productFormSchema } from '../model';
import { uploadImage } from 'modules/admin/shared/api/upload-image';
import { ProductWithDetails } from 'modules/admin/menu/products/entities';
import { formError, parsedFormData } from 'modules/admin/shared/utils/form.utils';
import { insertProduct, updateProduct } from 'modules/admin/menu/products/repository';

export const createProductAction = async (
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<ProductWithDetails>> => {
  const parsed = parsedFormData(formData, createProductSchema);

  if (!parsed.success) return formError({ fieldErrors: parsed.fieldErrors });

  const { title, image_file, current_image } = parsed.data;

  const product = {
    ...parsed.data,
    image_link: image_file ? await uploadImage(image_file, title) : current_image,
  };

  const response = await insertProduct(product);

  if (!response.ok) return formError({ message: response.message });

  updateTag('products');
  updateTag('home');
  redirect('/admin/menu/products');
};

export const updateProductAction = async (
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<ProductWithDetails>> => {
  const parsed = parsedFormData(formData, productFormSchema);

  if (!parsed.success) return formError({ fieldErrors: parsed.fieldErrors });

  const { title, image_file, current_image } = parsed.data;

  const product = {
    ...parsed.data,
    image_link: image_file ? await uploadImage(image_file, title) : current_image,
  };

  const response = await updateProduct(product);

  if (!response.ok) return formError({ message: response.message });

  updateTag('products');
  updateTag(`product-details-${product.id}`);
  updateTag('home');
  redirect('/admin/menu/products');
};
