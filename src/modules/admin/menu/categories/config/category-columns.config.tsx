'use client';

import { JSX } from 'react';
import Image from 'next/image';
import { GridColDef } from '@mui/x-data-grid';
import { MuiBox } from 'modules/admin/shared/ui/mui';

export const categoryColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  {
    field: 'image_link',
    headerName: 'Изображение',
    width: 100,
    sortable: false,
    renderCell: (params): JSX.Element => {
      const link =
        params.value === ''
          ? process.env.NEXT_PUBLIC_IMAGES_DOMAIN + 'categories/no-image.png'
          : process.env.NEXT_PUBLIC_IMAGES_DOMAIN + params.value;

      return (
        <MuiBox
          sx={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}
        >
          <Image src={link} width={64} height={48} loading="lazy" sizes="64px" alt={params.row.title} />
        </MuiBox>
      );
    },
  },
  { field: 'title', headerName: 'Название', minWidth: 150 },
  { field: 'slug', headerName: 'Ссылка' },
  { field: 'is_active', headerName: 'Доступность' },
  { field: 'sort_number', headerName: 'Сортировка' },
];
