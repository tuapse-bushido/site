import Link from 'next/link';
import { cacheLife } from 'next/cache';
import AddIcon from '@mui/icons-material/Add';
import { Button, Divider, Typography } from '@mui/material';
import { TableComponent } from 'modules/admin/shared/ui/table/table';
import { categoryColumns } from 'modules/admin/shared/ui/table/table-columns';
import { JSX } from 'react';
import { getAllCategories } from 'modules/admin/menu/categories';

export default async function CategoriesPage(): Promise<JSX.Element | null> {
  'use cache';
  cacheLife('admin');

  const categories = await getAllCategories();

  if (!categories.ok) return null;

  return (
    <div>
      <Typography variant={'h1'}>Категории</Typography>
      <Divider />

      <Link href={'/admin/menu/categories/create'}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} size="medium">
          Добавить категорию
        </Button>
      </Link>

      <TableComponent columns={categoryColumns} data={categories.data} slug={'menu/categories'} />
    </div>
  );
}
