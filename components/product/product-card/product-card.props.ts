import { Product } from '@/types/db/product';

export type ProductCardProps = {
  product: Product;
  variant: 'main' | 'page';
};
