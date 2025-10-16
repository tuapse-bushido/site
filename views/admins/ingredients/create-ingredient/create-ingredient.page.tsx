import { JSX } from 'react';
import { IngredientForm } from '@/components/forms/ingredient/ingredient-form';
import { actionCreateIngredient } from '@/utils/actions/ingredient.action';

export const CreateIngredientPage = (): JSX.Element => {
  return <IngredientForm action={actionCreateIngredient} />;
};
