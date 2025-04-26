import { HTMLAttributes } from 'react';
import { Category } from '@/types/db/category';
import { Product } from '@/types/db/product';

type Section = HTMLAttributes<HTMLDivElement>;

export type CategorySectionProps = Section & {
  category: Category;
  products: Product[];
};
