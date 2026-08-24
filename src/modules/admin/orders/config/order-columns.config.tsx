'use client';

import { GridColDef } from '@mui/x-data-grid';
import { JSX } from 'react';
import { OrderStatusChip } from 'modules/admin/orders/ui/order-status-chip';

type ResponsiveGridColDef = GridColDef & {
  hideOnMobile?: boolean;
};

export const orderColumns: ResponsiveGridColDef[] = [
  {
    field: 'status',
    headerName: 'Статус',
    width: 125,
    renderCell: (params): JSX.Element => <OrderStatusChip status={params.value} />,
  },
  { field: 'order_number', headerName: '№ Заказа', width: 100 },
  { field: 'formattedDate', headerName: 'Дата', width: 140 },
  {
    field: 'orderType',
    headerName: 'Тип',
    width: 120,
    hideOnMobile: true,
  },
  {
    field: 'total_price',
    headerName: 'Сумма',
    width: 110,
    type: 'number',
    align: 'left',
    headerAlign: 'left',
    valueFormatter: (value): string => `${value} ₽`,
    hideOnMobile: true,
  },
  { field: 'customer_name', headerName: 'Клиент', width: 150, hideOnMobile: true },

  { field: 'customer_phone', headerName: 'Телефон', width: 125, hideOnMobile: true },
  { field: 'fullAddress', headerName: 'Адрес доставки', flex: 1, hideOnMobile: true },
];
