'use client';
import { GridColDef } from '@mui/x-data-grid';
import { JSX } from 'react';
import { OrderStatusChip } from 'modules/admin/orders/ui/order-status-chip';

export const ingredientColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'title', headerName: 'Название' },
];

export const categoryColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'image_link', headerName: 'Изображение' },
  { field: 'title', headerName: 'Название' },
  { field: 'slug', headerName: 'Slug' },
  { field: 'is_active', headerName: 'Доступность' },
  { field: 'sort_number', headerName: 'Сортировка' },
];

export const productColumns: GridColDef[] = [
  { field: 'id', headerName: 'ID' },
  { field: 'image_link', headerName: 'Изображение' },
  { field: 'title', headerName: 'Название' },
  { field: 'price', headerName: 'Цена' },
  { field: 'weight', headerName: 'Вес' },
  { field: 'quantity', headerName: 'Кол-во блюд' },
  { field: 'count_portion', headerName: 'Кол-во порций' },
  { field: 'slug', headerName: 'Slug' },
  { field: 'is_active', headerName: 'Активно' },
  { field: 'is_visible', headerName: 'Видимо' },
  { field: 'is_set', headerName: 'Сет' },
];

export const orderColumns: GridColDef[] = [
  { field: 'order_number', headerName: '№ Заказа', width: 100 },
  { field: 'formattedDate', headerName: 'Дата', width: 140 },
  {
    field: 'status',
    headerName: 'Статус',
    width: 125,
    renderCell: (params): JSX.Element => <OrderStatusChip status={params.value} />,
  },
  {
    field: 'orderType',
    headerName: 'Тип',
    width: 120,
  },
  {
    field: 'total_price',
    headerName: 'Сумма',
    width: 110,
    type: 'number',
    valueFormatter: (value): string => `${value} ₽`,
  },
  { field: 'customer_name', headerName: 'Клиент', width: 150 },
  { field: 'customer_phone', headerName: 'Телефон', width: 125 },
  { field: 'fullAddress', headerName: 'Адрес доставки', flex: 1 },
];
