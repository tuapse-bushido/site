import { JSX } from 'react';
import { TableComponent } from 'modules/admin/shared/ui/table';
import { Ingredient } from 'modules/admin/menu/ingredients/entities';
import { PlusIcon } from 'modules/admin/menu/ingredients/screens/icons';
import { ingredientColumns } from 'modules/admin/shared/ui/table/table-columns';
import { MuiButton, MuiDivider, MuiStack, MuiSvgIcon, MuiTypography } from 'modules/admin/shared/ui/mui';
import { AddButton } from 'modules/admin/shared/ui/add-button/add-button';

type Props = {
  ingredients: Ingredient[];
};

export const IngredientsScreen = ({ ingredients }: Props): JSX.Element => {
  return (
    <MuiStack direction={'column'} gap={4} height={'100%'}>
      <MuiTypography variant={'h1'}>Ингредиенты</MuiTypography>
      <MuiDivider />
      {/*<MuiButton href={'/admin/menu/ingredients/create'} variant="contained" color="primary" size="medium">*/}
      {/*  <MuiSvgIcon component={PlusIcon} />*/}
      {/*  Добавить ингредиент*/}
      {/*</MuiButton>*/}
      <AddButton />
      <TableComponent columns={ingredientColumns} data={ingredients} slug={'menu/ingredients'} />
    </MuiStack>
  );
};
