'use client';

import { JSX, useState } from 'react';
import { Ingredient } from '../entities';
import { MuiPaper } from 'modules/admin/shared/ui/mui';
import { IngredientFormContent } from '../features/ingredient-form';

export const IngredientForm = ({ ingredient }: { ingredient?: Ingredient }): JSX.Element => {
  const [formKey, setFormKey] = useState(0);

  return (
    <MuiPaper sx={{ height: '100%', p: 4 }}>
      <IngredientFormContent
        key={formKey}
        ingredient={ingredient}
        setFormKeyAction={(): void => setFormKey((prev): number => prev + 1)}
      />
    </MuiPaper>
  );
};
