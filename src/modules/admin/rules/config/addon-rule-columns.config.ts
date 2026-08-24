'use client';

import { GridColDef } from '@mui/x-data-grid';

type ResponsiveGridColDef = GridColDef & {
  hideOnMobile?: boolean;
};

export const addonRuleColumns: ResponsiveGridColDef[] = [
  { field: 'id', headerName: 'ID', width: 100 },
  { field: 'title', headerName: 'Название', width: 100 },
  { field: 'is_active', headerName: 'Доступность' },
  { field: 'base_count', headerName: 'Базовое кол-во' },
  { field: 'divisor', headerName: 'Делитель' },
  { field: 'show_count_percent', headerName: '% Первого отображения' },
];
