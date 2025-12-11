'use client';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import { JSX, useActionState } from 'react';
import { useRouter } from 'next/navigation';
import TextField from '@mui/material/TextField';
import { Divider, Typography } from '@mui/material';
import { Ingredient } from '@/src/modules/admin/menu/ingredients';
import { createIngredientAction } from 'modules/admin/menu/ingredients';
import { updateIngredientAction } from 'modules/admin/menu/ingredients';

export const IngredientForm = ({ ingredient }: { ingredient?: Ingredient }): JSX.Element => {
  const router = useRouter();

  const action = ingredient ? updateIngredientAction : createIngredientAction;
  const [state, formAction] = useActionState(action, null);

  return (
    <Paper sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%', p: 2.5 }}>
      <Typography variant={'h3'}>Ингредиент - {ingredient ? `${ingredient.title}` : 'Новый ингредиент'}</Typography>

      <Divider />

      <Box
        component={'form'}
        action={formAction}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          alignItems: 'center',
        }}
      >
        {ingredient && <input type={'hidden'} name={'id'} defaultValue={ingredient.id} />}

        <TextField
          sx={{
            flex: 1,
            minWidth: { xs: '100%', sm: 250 },
            maxWidth: { sm: 400 },
            '& .MuiInputBase-root': {
              height: 56,
            },
          }}
          id="title"
          name={'title'}
          label="Название"
          defaultValue={ingredient?.title}
          helperText={state?.fieldErrors?.title ?? state?.message}
          required
        />

        {state?.message && <p>{state.message}</p>}

        <Box
          sx={{
            display: 'flex',
            gap: 1,
            width: { xs: '100%', sm: 240 },
            '& .MuiButton-root': {
              height: 56,
              width: '100%',
            },
          }}
        >
          <Button
            type={'button'}
            variant={'outlined'}
            sx={{
              order: { xs: 2, sm: 1 },
            }}
            onClick={(): void => router.push('/admin/menu/ingredients')}
          >
            Отмена
          </Button>
          <Button
            type={'submit'}
            variant={'contained'}
            color="success"
            sx={{
              order: { xs: 1, sm: 2 },
            }}
          >
            Сохранить
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};
