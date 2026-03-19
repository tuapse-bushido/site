'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { FormState } from 'shared/types/form.types';
import { formError, parsedFormData } from 'modules/admin/shared/utils/form.utils';
import { ingredientFormSchema, IngredientFormType, insertIngredient } from 'modules/admin/menu/ingredients';

export const createIngredientAction = async (
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<IngredientFormType>> => {
  const parsed = parsedFormData(formData, ingredientFormSchema);

  if (!parsed.success) return formError({ fieldErrors: parsed.fieldErrors });

  const response = await insertIngredient(parsed.data.title);

  if (!response.ok) return formError({ message: response.message });

  revalidatePath('/admin/menu/categories');
  redirect('/admin/menu/categories');
};
