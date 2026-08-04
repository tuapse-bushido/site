'use client';

import { JSX } from 'react';
import { Ingredient } from 'modules/admin/menu/ingredients/entities';
import { IngredientFormContent } from 'modules/admin/menu/ingredients/features';
import { FormResetContainer } from 'modules/admin/shared/ui/form-reset-container';

type Props = {
  ingredient?: Ingredient;
};

export const IngredientForm = ({ ingredient }: Props): JSX.Element => {
  return (
    <FormResetContainer>
      <IngredientFormContent ingredient={ingredient} />
    </FormResetContainer>
  );
};
