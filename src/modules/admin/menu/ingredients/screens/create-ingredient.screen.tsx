import { JSX } from 'react';
import { IngredientForm } from '../widgets';
import { MuiDivider, MuiStack, MuiTypography } from 'modules/admin/shared/ui/mui';

export const CreateIngredientScreen = (): JSX.Element => {
  return (
    <MuiStack direction={'column'} gap={4} height={'100%'}>
      <MuiTypography variant={'h1'}>Создание нового ингредиента</MuiTypography>

      <MuiDivider />

      <IngredientForm />
    </MuiStack>
  );
};
