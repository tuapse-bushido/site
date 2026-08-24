'use client';

import { JSX, useActionState } from 'react';
import { Ingredient } from 'modules/admin/menu/ingredients/entities';
import { deleteIngredientAction, upsertIngredientAction } from '../api';
import { MuiAlert, MuiBox, MuiTextField } from 'modules/admin/shared/ui/mui';
import { EntityFormActions } from 'modules/admin/shared/features/entity-form-actions';

type Props = {
  ingredient?: Ingredient | undefined;
};

export const IngredientFormContent = ({ ingredient }: Props): JSX.Element => {
  const boundAction = upsertIngredientAction.bind(null, ingredient?.id ? ingredient.id : null);
  const [state, formAction] = useActionState(boundAction, null);

  return (
    <MuiBox component={'form'} action={formAction} sx={{ width: 500 }}>
      <MuiTextField
        id="title"
        name={'title'}
        label="Название"
        defaultValue={ingredient?.title}
        fullWidth
        required
        error={!!state?.fieldErrors?.title}
        helperText={state?.fieldErrors?.title?.[0]}
      />

      {state?.message && !state?.fieldErrors && (
        <MuiAlert severity="error" variant="outlined">
          {state.message}
        </MuiAlert>
      )}

      <EntityFormActions
        id={ingredient?.id}
        cancelPath={'/admin/menu/ingredients'}
        onDeleteAction={deleteIngredientAction}
      />
    </MuiBox>
  );
};
