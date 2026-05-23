'use client';

import { JSX } from 'react';
import { IngredientFormContent } from 'modules/admin/menu/ingredients/features';
import { FormResetContainer } from 'modules/admin/shared/ui/form-reset-container';
import { Ingredient } from 'modules/admin/menu/ingredients/entities';

type Props = {
  ingredient: Ingredient;
};

export const IngredientForm = ({ ingredient }: Props): JSX.Element => {
  return (
    <FormResetContainer
      renderAction={(reset): JSX.Element => <IngredientFormContent ingredient={ingredient} setFormKeyAction={reset} />}
    />
  );
};
