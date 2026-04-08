import IngredientIcon from './icons/ingredient.svg';
import CategoryIcon from './icons/category.svg';
import ProductIcon from './icons/product.svg';
import { JSX } from 'react';

export type MenuConfig = {
  title: string;
  count: number;
  icon: JSX.Element;
  href: string;
  bg: string;
};

export const getMenuDashboardConfig = (counts: {
  categories: number;
  ingredients: number;
  products: number;
}): MenuConfig[] => [
  {
    title: 'Ингредиенты',
    count: counts.ingredients,
    icon: <IngredientIcon color="success" />,
    href: '/admin/menu/ingredients',
    bg: 'rgba(46, 125, 50, 0.08)',
  },
  {
    title: 'Категории',
    count: counts.categories,
    icon: <CategoryIcon color="primary" />,
    href: '/admin/menu/categories',
    bg: 'rgba(25, 118, 210, 0.08)',
  },
  {
    title: 'Продукты',
    count: counts.products,
    icon: <ProductIcon color="secondary" />,
    href: '/admin/menu/products',
    bg: 'rgba(156, 39, 176, 0.08)',
  },
];
