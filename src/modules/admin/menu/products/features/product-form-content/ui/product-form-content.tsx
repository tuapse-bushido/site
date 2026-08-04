'use client';

import { deleteProductAction, upsertProductAction } from '../api';
import { JSX, useActionState, useState } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import { optionsMapper } from 'modules/admin/menu/products';
import { PickedImage } from 'modules/admin/shared/ui/picked-image';
import { ProductEditData, UpsertProductForm } from 'modules/admin/menu/products/entities';
import { EntityFormActions } from 'modules/admin/shared/features/entity-form-actions';
import { MuiAlert, MuiBox, MuiStack, MuiTextField } from 'modules/admin/shared/ui/mui';
import { getSelectValue, selectOptions } from 'modules/admin/shared/config/select-options';
import { SelectComponent } from 'modules/admin/shared/ui/select-component/select-component';

export const ProductFormContent = ({ productData }: { productData: ProductEditData }): JSX.Element => {
  const product = productData && productData.product;
  const ingredients = productData && productData.ingredients;
  const categories = productData && productData.categories;
  const products = productData && productData.products;

  const [isSet, setIsSet] = useState<boolean>(product?.is_set ?? false);

  const boundAction = upsertProductAction.bind(null, product?.id ?? null);
  const [state, formAction] = useActionState(boundAction, null);

  const getFieldError = (field: keyof UpsertProductForm): string | undefined => {
    const errors = state?.fieldErrors?.[field];

    return Array.isArray(errors) ? errors[0] : errors;
  };

  return (
    <MuiStack
      id="product-form"
      component={'form'}
      action={formAction}
      direction="column"
      gap={3}
      sx={{ maxWidth: '100rem' }}
    >
      <MuiTextField
        id="title"
        name="title"
        label="Название"
        defaultValue={state?.data?.title ?? product?.title}
        error={!!getFieldError('title')}
        helperText={getFieldError('title')}
        required
      />

      <MuiBox sx={gridContainerStyles}>
        <MuiBox sx={imageWrapperStyles}>
          <PickedImage imageLink={product?.image_link} altImage={product?.title} />
        </MuiBox>

        <SelectComponent
          label={'Категория'}
          name={'categories'}
          options={optionsMapper.options(categories)}
          defaultSelect={optionsMapper.defaultSelect(product?.categories)}
          multiple={true}
          error={!!getFieldError('categories')}
          helperText={getFieldError('categories')}
        />

        <MuiTextField
          id="price"
          name="price"
          label="Цена"
          defaultValue={state?.data?.price ?? product?.price ?? 0}
          error={!!getFieldError('price')}
          helperText={getFieldError('price')}
        />

        <MuiTextField
          id="weight"
          name="weight"
          label="Вес"
          defaultValue={state?.data?.weight ?? product?.weight ?? 0}
          error={!!getFieldError('weight')}
          helperText={getFieldError('weight')}
        />

        <SelectComponent
          label={'Ингредиенты'}
          name={'ingredients'}
          options={optionsMapper.options(ingredients)}
          defaultSelect={optionsMapper.defaultSelect(product?.ingredients)}
          multiple={true}
          error={!!getFieldError('ingredients')}
          helperText={getFieldError('ingredients')}
        />

        <MuiTextField
          id="slug"
          name="slug"
          label="Ссылка"
          defaultValue={state?.data?.slug ?? product?.slug}
          error={!!getFieldError('slug')}
          helperText={getFieldError('slug')}
        />

        <SelectComponent
          label={'Доступность'}
          name={'is_active'}
          options={selectOptions.is_active.options}
          defaultSelect={getSelectValue('is_active', state?.data?.is_active ?? product?.is_active)}
          error={!!getFieldError('is_active')}
          helperText={getFieldError('is_active')}
        />

        <SelectComponent
          label={'Видимость'}
          name={'is_visible'}
          options={selectOptions.is_visible.options}
          defaultSelect={getSelectValue('is_visible', state?.data?.is_visible ?? product?.is_visible)}
          error={!!getFieldError('is_visible')}
          helperText={getFieldError('is_visible')}
        />

        <MuiTextField
          id="count_portion"
          name="count_portion"
          label="Количество порций"
          defaultValue={state?.data?.count_portion ?? product?.count_portion ?? 1}
          error={!!getFieldError('count_portion')}
          helperText={getFieldError('count_portion')}
        />

        <MuiTextField
          id="quantity"
          name="quantity"
          label="Количество блюд"
          defaultValue={state?.data?.quantity ?? product?.quantity ?? 1}
          error={!!getFieldError('quantity')}
          helperText={getFieldError('quantity')}
        />
      </MuiBox>

      <MuiStack direction="row" gap={2}>
        <input type="hidden" name="is_set" value={String(isSet)} />
        <FormControlLabel
          sx={{ height: '56px', flexShrink: 0 }}
          control={<Checkbox checked={isSet} onChange={(e): void => setIsSet(e.target.checked)} />}
          label="Это сет?"
        />

        {!isSet && <input type="hidden" name="set_items" value="" />}
        {isSet && (
          <MuiBox sx={{ flexGrow: 1 }}>
            <SelectComponent
              label="Состав сета"
              name="set_items"
              options={optionsMapper.options(products)}
              defaultSelect={optionsMapper.defaultSelect(product?.set_items)}
              multiple={true}
              error={!!getFieldError('set_items')}
              helperText={getFieldError('set_items')}
            />
          </MuiBox>
        )}
      </MuiStack>

      {state?.message && !state?.fieldErrors && (
        <MuiAlert severity="error" variant="outlined">
          {state.message}
        </MuiAlert>
      )}

      <EntityFormActions id={product?.id} cancelPath="/admin/menu/products" onDeleteAction={deleteProductAction} />
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
