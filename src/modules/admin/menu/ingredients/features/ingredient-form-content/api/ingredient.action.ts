'use server';

import { redirect } from 'next/navigation';
import { FormState } from 'shared/types/form.types';
import { ingredientCases } from 'modules/admin/menu/ingredients/use-cases';
import { formErrorNew, parsedFormDataNew } from 'modules/admin/shared/utils/form.utils';
import { ingredientSchemas as schemas, UpsertIngredient } from 'modules/admin/menu/ingredients/entities';
import { ingredientService } from 'modules/admin/menu/ingredients/services';
import { invalidateIngredientCache } from 'modules/admin/shared/utils/cache-invalidation.utils';

export const upsertIngredientAction = async (
  ingredientId: number | null,
  _prevState: FormState | null,
  formData: FormData,
): Promise<FormState<UpsertIngredient>> => {
  const { schema, extraData } = ingredientId
    ? { schema: schemas.update, extraData: { id: ingredientId } }
    : { schema: schemas.create, extraData: {} };

  const parsed = parsedFormDataNew(formData, schema, extraData);

  if (!parsed.success) return formErrorNew({ fieldErrors: parsed.fieldErrors });

  const response = await ingredientCases.upsertIngredientCase(parsed.data, ingredientId ? 'update' : 'insert');

  if (!response.ok) {
    return formErrorNew({
      code: response.code,
      options: response.options,
      data: parsed.data,
    });
  }

  invalidateIngredientCache();

  redirect('/admin/menu/ingredients');
};

export const deleteIngredientAction = async (ingredientId: number): Promise<FormState<null>> => {
  const response = await ingredientService.syncDeleteIngredient(ingredientId);

  if (!response.ok) {
    return formErrorNew({
      code: response.code,
      options: response.options,
    });
  }

  invalidateIngredientCache();

  redirect('/admin/menu/ingredients');
};
