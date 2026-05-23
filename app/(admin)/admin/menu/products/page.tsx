import { JSX } from 'react';
import Link from 'next/link';
import { cacheLife } from 'next/cache';
import AddIcon from '@mui/icons-material/Add';
import { Button, Divider, Typography } from '@mui/material';
import { TableComponent } from '../../../../../src/modules/admin/shared/ui/entity-page-template/ui/table';
import { productColumns } from '../../../../../src/modules/admin/shared/ui/entity-page-template/model/table.config';
import { getAllProducts } from 'modules/admin/menu/products/repository';
import { MuiBox } from 'modules/admin/shared/ui/mui';

export default async function ProductsPage(): Promise<JSX.Element | null> {
  'use cache';
  cacheLife('admin');

  const products = await getAllProducts();

  if (!products.ok) return null;

  return (
    <MuiBox
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        height: '100%',
        boxSizing: 'border-box',
        pb: 2, // небольшой отступ снизу, чтобы таблица не липла к краю
      }}
    >
      <Typography variant={'h1'}>Продукты</Typography>
      <Divider />

      <Link href={'/admin/menu/products/create'}>
        <Button variant="contained" color="primary" startIcon={<AddIcon />} size="medium">
          Добавить продукт
        </Button>
      </Link>

      <MuiBox sx={{ flex: 1, minHeight: 0, width: '100%' }}>
        <TableComponent columns={productColumns} data={products.data} slug={'menu/products'} />
      </MuiBox>
    </MuiBox>
  );
}
