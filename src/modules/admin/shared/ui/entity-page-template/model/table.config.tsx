import { GridColDef } from '@mui/x-data-grid';
import { Category } from 'modules/admin/menu/categories/entities';
import { Ingredient } from 'modules/admin/menu/ingredients/entities';
import { categoryColumns } from 'modules/admin/menu/categories/config';
import { Order } from 'modules/admin/orders/entities';
import { orderColumns } from 'modules/admin/orders/config';

type EntityMap = {
  ingredients: Ingredient;
  categories: Category;
  orders: Order;
};

type TableSlug = keyof EntityMap;

type TableSchema<T> = {
  label: {
    plural: string;
    singular: string;
  };
  searchKey: keyof T;
  href: {
    create: string;
    edit: (id: string | number) => string;
  };
  columns: GridColDef[];
};

export const TABLE_CONFIG: { [K in TableSlug]: TableSchema<EntityMap[K]> } = {
  ingredients: {
    label: {
      plural: 'Ингредиенты',
      singular: 'ингредиент',
    },
    searchKey: 'title',
    href: {
      create: '/admin/menu/ingredients/create',
      edit: (id): string => `/admin/menu/ingredients/${id}`,
    },
    columns: [
      { field: 'id', headerName: 'ID', width: 100 },
      { field: 'title', headerName: 'Название', flex: 1, minWidth: 150 },
    ],
  },
  categories: {
    label: {
      plural: 'Категории',
      singular: 'категорию',
    },
    searchKey: 'title',
    href: {
      create: '/admin/menu/categories/create',
      edit: (id): string => `/admin/menu/categories/${id}`,
    },
    columns: categoryColumns,
  },
  orders: {
    label: {
      plural: 'Категории',
      singular: 'категорию',
    },
    searchKey: 'status',
    href: {
      create: '/admin/menu/categories/create',
      edit: (id): string => `/admin/menu/categories/${id}`,
    },
    columns: orderColumns,
  },
};

// export type KeyColumns = keyof typeof TABLE_CONFIG;
//
// export const ingredientColumns: GridColDef[] = [
//   { field: 'id', headerName: 'ID', width: 100 },
//   { field: 'title', headerName: 'Название', flex: 1, minWidth: 150 },
// ];
//
// export const categoryColumns: GridColDef[] = [
//   { field: 'id', headerName: 'ID' },
//   { field: 'image_link', headerName: 'Изображение' },
//   { field: 'title', headerName: 'Название' },
//   { field: 'slug', headerName: 'Slug' },
//   { field: 'is_active', headerName: 'Доступность' },
//   { field: 'sort_number', headerName: 'Сортировка' },
// ];
//
// export const productColumns: GridColDef[] = [
//   { field: 'id', headerName: 'ID' },
//   { field: 'image_link', headerName: 'Изображение' },
//   { field: 'title', headerName: 'Название' },
//   { field: 'price', headerName: 'Цена' },
//   { field: 'weight', headerName: 'Вес' },
//   { field: 'quantity', headerName: 'Кол-во блюд' },
//   { field: 'count_portion', headerName: 'Кол-во порций' },
//   { field: 'slug', headerName: 'Slug' },
//   { field: 'is_active', headerName: 'Активно' },
//   { field: 'is_visible', headerName: 'Видимо' },
//   { field: 'is_set', headerName: 'Сет' },
// ];
//
// export const orderColumns: GridColDef[] = [
//   { field: 'order_number', headerName: '№ Заказа', width: 100 },
//   { field: 'formattedDate', headerName: 'Дата', width: 140 },
//   {
//     field: 'status',
//     headerName: 'Статус',
//     width: 125,
//     renderCell: (params): JSX.Element => <OrderStatusChip status={params.value} />,
//   },
//   {
//     field: 'orderType',
//     headerName: 'Тип',
//     width: 120,
//   },
//   {
//     field: 'total_price',
//     headerName: 'Сумма',
//     width: 110,
//     type: 'number',
//     align: 'left',
//     headerAlign: 'left',
//     valueFormatter: (value): string => `${value} ₽`,
//   },
//   { field: 'customer_name', headerName: 'Клиент', width: 150 },
//   { field: 'customer_phone', headerName: 'Телефон', width: 125 },
//   { field: 'fullAddress', headerName: 'Адрес доставки', flex: 1 },
// ];
