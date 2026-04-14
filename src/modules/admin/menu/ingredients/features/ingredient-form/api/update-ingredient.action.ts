'use server';

import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { formError, parsedFormData } from 'modules/admin/shared/utils/form.utils';
import {
  Ingredient,
  ingredientFormSchema,
  IngredientFormType,
  updateIngredientById,
} from 'modules/admin/menu/ingredients';

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

  const response = await updateIngredientById(ingredient);

  if (!response.ok) return formError({ message: response.message });

  updateTag('ingredients');
  updateTag(`ingredient-${response.data.id}`);
  redirect('/admin/menu/ingredients');
};
