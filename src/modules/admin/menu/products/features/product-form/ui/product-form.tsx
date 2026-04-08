'use client';

import { JSX, useActionState, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox, Divider, FormControlLabel, Typography } from '@mui/material';
import {
  createProductAction,
  updateProductAction,
} from 'modules/admin/menu/products/features/product-form/api/create-product.action';
import { ProductEditData } from 'modules/admin/menu/products/use-cases/product.cases.types';
import { PickedImage } from 'modules/admin/shared/ui/picked-image';
import { MuiBox, MuiButton, MuiPaper, MuiTextField } from 'shared/ui/mui';
import { SelectComponent } from 'modules/admin/shared/ui/select-component/select-component';
import { getSelectValue, selectOptions } from 'modules/admin/shared/config/select-options';
import { optionsMapper } from 'modules/admin/menu/products';

export const ProductForm = ({ productData }: { productData: ProductEditData }): JSX.Element => {
  const product = productData && productData.product;
  const ingredients = productData && productData.ingredients;
  const categories = productData && productData.categories;
  const products = productData && productData.products;

  const [isSet, setIsSet] = useState<boolean>(product?.is_set ?? false);

  const router = useRouter();

  const action = product ? updateProductAction : createProductAction;
  const [state, formAction] = useActionState(action, null);

  const styles = {
    paper: { display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%', p: 2.5 },
    form: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 1fr)',
      gap: 1.5,
      alignItems: 'center',
    },
    input: {
      flex: 1,
      minWidth: { xs: '100%', sm: 250 },
      maxWidth: { sm: 400 },
      '& .MuiInputBase-root': {
        height: 56,
      },
    },
    buttonContainer: {
      display: 'flex',
      gap: 1,
      width: { xs: '100%', sm: 240 },
      '& .MuiButton-root': {
        height: 56,
        width: '100%',
      },
    },
  };

  return (
    <MuiPaper sx={styles.paper}>
      <Typography variant={'h3'}>Блюдо - {product ? `${product.title}` : 'Новое блюдо'}</Typography>

      <Divider />

      <MuiBox component={'form'} action={formAction} sx={styles.form}>
        {product && <input type={'hidden'} name={'id'} defaultValue={product.id} />}

        <MuiTextField
          sx={styles.input}
          id="title"
          name={'title'}
          label="Название"
          defaultValue={product?.title}
          required
        />

        <PickedImage imageLink={product?.image_link} altImage={product?.title} />

        <SelectComponent
          label={'Доступность'}
          name={'is_active'}
          options={selectOptions.is_active.options}
          defaultSelect={getSelectValue('is_active', product?.is_active)}
        />

        <SelectComponent
          label={'Видимость'}
          name={'is_visible'}
          options={selectOptions.is_visible.options}
          defaultSelect={getSelectValue('is_visible', product?.is_active)}
        />

        <SelectComponent
          label={'Категория'}
          name={'categories'}
          options={optionsMapper.options(categories)}
          defaultSelect={optionsMapper.defaultSelect(product?.categories)}
          multiple={true}
        />

        <SelectComponent
          label={'Ингредиенты'}
          name={'ingredients'}
          options={optionsMapper.options(ingredients)}
          defaultSelect={optionsMapper.defaultSelect(product?.ingredients)}
          multiple={true}
        />

        <MuiTextField sx={styles.input} id="slug" name="slug" label="Ссылка" defaultValue={product?.slug} />

        <MuiTextField sx={styles.input} id="price" name="price" label="Цена" defaultValue={product?.price ?? 0} />

        <MuiTextField sx={styles.input} id="weight" name="weight" label="Вес" defaultValue={product?.weight ?? 0} />

        <MuiTextField
          sx={styles.input}
          id="count_portion"
          name="count_portion"
          label="Количество порций"
          defaultValue={product?.count_portion ?? 1}
        />

        <MuiTextField
          sx={styles.input}
          id="quantity"
          name="quantity"
          label="Количество блюд"
          defaultValue={product?.quantity ?? 1}
        />

        <input type="hidden" name="is_set" value={String(isSet)} />
        <FormControlLabel
          control={<Checkbox checked={isSet} onChange={(e): void => setIsSet(e.target.checked)} />}
          label="Это сет"
        />

        <input type="hidden" name="set_items" value="" />
        {isSet && (
          <SelectComponent
            label="Состав сета"
            name="set_items"
            options={optionsMapper.options(products)}
            defaultSelect={optionsMapper.defaultSelect(product?.set_items)}
            multiple={true}
          />
        )}

        <MuiBox sx={styles.buttonContainer}>
          <MuiButton
            type={'button'}
            variant={'outlined'}
            sx={{
              order: { xs: 2, sm: 1 },
            }}
            onClick={(): void => router.push('/admin/menu/products')}
          >
            Отмена
          </MuiButton>
          <MuiButton
            type={'submit'}
            variant={'contained'}
            color="success"
            sx={{
              order: { xs: 1, sm: 2 },
            }}
          >
            Сохранить
          </MuiButton>
        </MuiBox>
      </MuiBox>
    </MuiPaper>
  );
};
