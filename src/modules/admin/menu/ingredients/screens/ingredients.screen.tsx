import { JSX } from 'react';
import { TableComponent } from 'modules/admin/shared/ui/table';
import { Ingredient } from 'modules/admin/menu/ingredients/entities';
import { AddButton } from 'modules/admin/shared/ui/add-button/add-button';
import { ingredientColumns } from 'modules/admin/shared/ui/table/table-columns';
import { MuiDivider, MuiStack, MuiTypography } from 'modules/admin/shared/ui/mui';

type Props = {
  ingredients: Ingredient[];
};

export const IngredientsScreen = ({ ingredients }: Props): JSX.Element => {
  return (
    <MuiStack direction={'column'} gap={4} height={'100%'}>
      <MuiTypography variant={'h1'}>Ингредиенты</MuiTypography>
      <MuiDivider />

      <AddButton />
      <TableComponent columns={ingredientColumns} data={ingredients} slug={'menu/ingredients'} />
    </MuiStack>
  );
};
