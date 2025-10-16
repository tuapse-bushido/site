import { JSX } from 'react';
import { IngredientForm } from '@/components/forms/ingredient/ingredient-form';
import { getIngredientById } from '@/libs/db/ingredients/ingredients';
import { UpdateIngredientPageProps } from '@/views/admins/ingredients/update-ingredient/update-ingredient.props';
import { actionUpdateIngredient } from '@/utils/actions/ingredient.action';
import { preparedAction } from '@/utils/actions/form-action-utils';

export const UpdateIngredientPage = async ({ params }: UpdateIngredientPageProps): Promise<JSX.Element | null> => {
  const id = (await params).id;
  const ingredient = await getIngredientById(id);

  if (!ingredient.success) return null;

  const action = preparedAction(actionUpdateIngredient, ingredient.data);

  return <IngredientForm ingredient={ingredient.data} action={action} />;
};
