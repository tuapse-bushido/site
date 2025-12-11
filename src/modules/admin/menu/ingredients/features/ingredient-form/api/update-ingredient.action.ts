'use server';

import { redirect } from 'next/navigation';
import { FormState } from '@/src/shared/types';
import { revalidatePath, updateTag } from 'next/cache';
import { formError, parsedFormData } from '@/src/shared/utils';
import { ingredientFormSchema, IngredientFormType } from 'modules/admin/menu/ingredients';
import { Ingredient, updateIngredient } from '@/src/modules/admin/menu/ingredients';

export const updateIngredientAction = async (
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<IngredientFormType>> => {
  const parsed = parsedFormData(formData, ingredientFormSchema);

  if (!parsed.success) return formError({ fieldErrors: parsed.fieldErrors, data: parsed.data });

  const ingredient: Ingredient = {
    ...parsed.data,
    id: Number(parsed.data.id),
  };

  const response = await updateIngredient(ingredient);

  if (!response.ok) return formError({ message: response.message });

  updateTag('ingredients');
  updateTag(`ingredient-${response.data.id}`);
  revalidatePath('/admin/menu/ingredients');
  redirect('/admin/menu/ingredients');
};
