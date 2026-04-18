import { JSX, ReactNode } from 'react';
import { MuiDivider, MuiStack, MuiTypography } from 'modules/admin/shared/ui/mui';

type Props = {
  children: ReactNode;
};

export const UpdateIngredientScreen = ({ children }: Props): JSX.Element => {
  return (
    <MuiStack direction={'column'} gap={4} height={'100%'}>
      <MuiTypography variant={'h1'}>Редактирование ингредиента</MuiTypography>

      <MuiDivider />

      {children}
    </MuiStack>
  );
};
