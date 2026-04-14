'use client';

import { JSX, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { Divider, Typography } from '@mui/material';
import { PickedImage } from 'modules/admin/shared/ui/picked-image';
import { getSelectValue, selectOptions } from 'modules/admin/shared/config/select-options';
import { MuiBox, MuiButton, MuiPaper, MuiTextField } from 'modules/admin/shared/ui/mui';
import { SelectComponent } from 'modules/admin/shared/ui/select-component/select-component';
import { Category, createCategoryAction, updateCategoryAction } from 'modules/admin/menu/categories';

export const CategoryForm = ({ category }: { category?: Category }): JSX.Element => {
  const router = useRouter();

  const action = category ? updateCategoryAction : createCategoryAction;
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
      <Typography variant={'h3'}>Категория - {category ? `${category.title}` : 'Новая категория'}</Typography>

      <Divider />

      <MuiBox component={'form'} action={formAction} sx={styles.form}>
        {category && <input type={'hidden'} name={'id'} defaultValue={category.id} />}

        <MuiTextField
          sx={styles.input}
          id="title"
          name={'title'}
          label="Название"
          defaultValue={category?.title}
          helperText={state?.fieldErrors?.title ?? state?.message}
          required
        />

        <PickedImage imageLink={category?.image_link} altImage={category?.title} />

        <SelectComponent
          label={'Доступность'}
          name={'is_active'}
          options={selectOptions.is_active.options}
          defaultSelect={getSelectValue('is_active', category?.is_active)}
        />

        <MuiTextField
          sx={styles.input}
          id="slug"
          name="slug"
          label="Ссылка"
          defaultValue={category?.slug}
          helperText={state?.fieldErrors?.slug}
        />

        <MuiTextField
          sx={styles.input}
          id="sort_number"
          name="sort_number"
          label="Сортировка"
          defaultValue={category?.sort_number || 0}
          helperText={state?.fieldErrors?.sort_number}
        />

        {state?.message && <p>{state.message}</p>}
        <MuiBox sx={styles.buttonContainer}>
          <MuiButton
            type={'button'}
            variant={'outlined'}
            sx={{
              order: { xs: 2, sm: 1 },
            }}
            onClick={(): void => router.push('/admin/menu/categories')}
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
