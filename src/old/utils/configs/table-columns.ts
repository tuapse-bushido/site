import { Ingredient } from '@/types/db/tables/ingredient';
import { Category, Product } from '@/types';

export type TablesType = Ingredient | Category | Product;

type ColumnKey<T> = (keyof T)[];
export const ingredientColumns: ColumnKey<Ingredient> = ['id', 'title'];
export const categoryColumns: ColumnKey<Category> = ['id', 'image_link', 'title', 'slug', 'is_active', 'sort_number'];
export const productColumns: ColumnKey<Product> = [
  'id',
  'image_link',
  'title',
  'price',
  'weight',
  'quantity',
  'count_portion',
  'slug',
  'is_active',
  'is_visible',
  'is_set',
];

export type TitleColumns<T> = {
  [K in keyof T]?: string;
};
export const titleColumns = {
  id: 'ID',
  title: 'Название',
  image_link: 'Изображение',
  slug: 'Ссылка',
  is_active: 'Доступность',
  sort_number: 'Сортировка',
  price: 'Цена',
  weight: 'Вес',
  quantity: 'Количество блюд',
  count_portion: 'Количество порций',
  is_visible: 'Видимость',
  is_set: 'Сет',
};
