import { GridColDef } from '@mui/x-data-grid';
import { OrderItem } from 'modules/admin/orders/entities';

export const orderItemsColumns: GridColDef<OrderItem>[] = [
  {
    field: 'title',
    headerName: 'Товар',
    flex: 1,
  },
  {
    field: 'price',
    headerName: 'Цена',
    width: 120,
    type: 'number',
    valueFormatter: (value: number): string => `${value.toLocaleString('ru-RU')} ₽`,
  },
  {
    field: 'quantity',
    headerName: 'Кол-во',
    width: 100,
    type: 'number',
    valueFormatter: (value: number): string => `${value} шт.`,
  },
  {
    field: 'total_price',
    headerName: 'Сумма',
    width: 130,
    type: 'number',
    valueFormatter: (value: number): string => `${value.toLocaleString('ru-RU')} ₽`,
  },
];
