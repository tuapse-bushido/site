import { HTMLAttributes } from 'react';
import { Category } from '@/types/db/tables/category';
import { ProductCard } from '@/types';

type Section = HTMLAttributes<HTMLDivElement>;

export type CategorySectionProps = Section & {
  category: Category;
  products: ProductCard[];
};
