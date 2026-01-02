import { GridColDef } from '@mui/x-data-grid';

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
