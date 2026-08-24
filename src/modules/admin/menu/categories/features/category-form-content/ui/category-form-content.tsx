'use client';

import { JSX, useActionState } from 'react';
import { PickedImage } from 'modules/admin/shared/ui/picked-image';
import { deleteCategoryAction, upsertCategoryAction } from '../api';
import { Category, UpsertFormCategory } from 'modules/admin/menu/categories/entities';
import { EntityFormActions } from 'modules/admin/shared/features/entity-form-actions';
import { MuiAlert, MuiBox, MuiStack, MuiTextField } from 'modules/admin/shared/ui/mui';
import { getSelectValue, selectOptions } from 'modules/admin/shared/config/select-options';
import { SelectComponent } from 'modules/admin/shared/ui/select-component/select-component';

type Props = {
  category?: Category | undefined;
};

export const CategoryFormContent = ({ category }: Props): JSX.Element => {
  const boundAction = upsertCategoryAction.bind(null, category?.id ?? null);
  const [state, formAction] = useActionState(boundAction, null);

  const getFieldError = (field: keyof UpsertFormCategory): string | undefined => {
    if (!state?.fieldErrors) return undefined;

    const errors = state.fieldErrors[field as keyof typeof state.fieldErrors];

    return Array.isArray(errors) ? errors[0] : errors;
  };

  return (
    <MuiStack
      id="category-form"
      component="form"
      action={formAction}
      direction="column"
      gap={3}
      sx={{ maxWidth: '100rem' }}
    >
      <MuiTextField
        id="title"
        name="title"
        label="Название"
        defaultValue={state?.data?.title ?? category?.title}
        error={!!getFieldError('title')}
        helperText={getFieldError('title')}
        required
      />

      <MuiBox sx={gridContainerStyles}>
        <MuiBox sx={imageWrapperStyles}>
          <PickedImage imageLink={category?.image_link} altImage={category?.title} />
        </MuiBox>

        <SelectComponent
          label="Доступность"
          name="is_active"
          options={selectOptions.is_active.options}
          defaultSelect={getSelectValue('is_active', state?.data?.is_active ?? category?.is_active)}
        />

        <MuiTextField
          id="slug"
          name="slug"
          label="Ссылка"
          defaultValue={state?.data?.slug ?? category?.slug}
          error={!!getFieldError('slug')}
          helperText={getFieldError('slug')}
        />

        <MuiTextField
          id="sort_number"
          name="sort_number"
          label="Сортировка"
          defaultValue={state?.data?.sort_number ?? category?.sort_number ?? 0}
          error={!!getFieldError('sort_number')}
          helperText={getFieldError('sort_number')}
        />
      </MuiBox>

      {state?.message && !state?.fieldErrors && (
        <MuiAlert severity="error" variant="outlined">
          {state.message}
        </MuiAlert>
      )}

      <EntityFormActions id={category?.id} cancelPath="/admin/menu/categories" onDeleteAction={deleteCategoryAction} />
    </MuiStack>
  );
};

const gridContainerStyles = {
  display: 'grid',
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
  gap: 3,
  alignItems: 'start',
};

const imageWrapperStyles = {
  gridColumn: { sm: '2' },
  gridRow: { sm: '1 / span 3' },
  display: 'flex',
  width: '100%',
  height: { xs: '15rem', sm: '100%' },
  alignSelf: 'stretch',
};
