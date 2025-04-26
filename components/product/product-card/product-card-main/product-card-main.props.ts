import { Product } from '@/types/db/product';
import { HTMLAttributes } from 'react';

type Div = HTMLAttributes<HTMLDivElement>;

export type ProductCardMainProps = Div & {
  type: 'main' | 'cart';
  product: Product;
};
