import { JSX } from 'react';
import Link from 'next/link';
import { cacheLife } from 'next/cache';
import AddIcon from '@mui/icons-material/Add';
import { Button, Divider, Typography } from '@mui/material';
import { getAllIngredients } from '../../../../../src/modules/admin/menu/ingredients';
import { TableComponent } from '../../../../../src/modules/admin/shared/ui/table/table';
import { ingredientColumns } from 'modules/admin/shared/ui/table/table-columns';

export default async function IngredientsPage(): Promise<JSX.Element | null> {
  'use cache';
  cacheLife('admin');

  const ingredients = await getAllIngredients();

  if (!ingredients.ok) return null;

  return (
    <div>
      <Typography variant={'h1'}>Ингредиенты</Typography>
      <Divider />

      <Link href={'/admin/menu/ingredients/create'}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} size="medium">
          Добавить ингредиент
        </Button>
      </Link>

      <TableComponent columns={ingredientColumns} data={ingredients.data} slug={'menu/ingredients'} />
    </div>
  );
}
