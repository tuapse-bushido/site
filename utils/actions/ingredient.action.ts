'use server';

import { insertIngredient, updateIngredient } from '@/libs/db/ingredients/ingredients';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { FormState, ingredientFormSchema } from '@/types/actions/form-schemas';
import { Ingredient } from '@/types/db/tables/ingredient';
import { prepareData } from '@/utils/actions/form-action-utils';

export const actionCreateIngredient = async (prevState: FormState, formData: FormData): Promise<FormState> => {
  const data = prepareData(formData, ingredientFormSchema);

  if ('success' in data) return data;

  const { title } = data;
  const response = await insertIngredient(title);

  if (!response.success)
    return {
      success: false,
      fields: {
        general: response.message,
      },
    };

  revalidatePath('/admin/menu/ingredients');
  redirect('/admin/menu/ingredients');
};

export const actionUpdateIngredient = async (
  prevState: FormState | null,
  formData: FormData,
  ingredient: Ingredient,
): Promise<FormState> => {
  const data = prepareData(formData, ingredientFormSchema);

  if ('success' in data) return data;

  const { id } = ingredient;
  const { title } = data;
  const response = await updateIngredient(id, title);

  if (!response.success)
    return {
      success: false,
      fields: {
        general: response.message,
      },
    };

  revalidatePath('/admin/menu/ingredients');
  redirect('/admin/menu/ingredients');
};
