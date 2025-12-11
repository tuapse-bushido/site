'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { FormState } from '@/src/shared/types';
import { formError, parsedFormData } from '@/src/shared/utils';
import { insertIngredient } from '@/src/modules/admin/menu/ingredients/repository/ingredient.repository';
import { ingredientFormSchema, IngredientFormType } from 'modules/admin/menu/ingredients';

export const createIngredientAction = async (
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<IngredientFormType>> => {
  const parsed = parsedFormData(formData, ingredientFormSchema);

  if (!parsed.success) return formError({ fieldErrors: parsed.fieldErrors });

  const { title } = parsed.data;

  const response = await insertIngredient(title);

  if (!response.ok) return formError({ message: response.message });

  revalidatePath('/admin/menu/ingredients');
  redirect('/admin/menu/ingredients');
};
