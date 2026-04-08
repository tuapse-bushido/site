'use client';

import { JSX } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { OrderItem } from 'modules/admin/orders/entities';
import { orderItemsColumns } from './items-column.config';

type OrderItemsTableProps = {
  items: OrderItem[];
  loading?: boolean;
};

export const OrderItemsTable = ({ items, loading = false }: OrderItemsTableProps): JSX.Element => {
  return (
    <DataGrid
      rows={items}
      columns={orderItemsColumns}
      getRowId={(row): number => row.id}
      loading={loading}
      hideFooter
      autoHeight
      disableRowSelectionOnClick
    />
  );
};
