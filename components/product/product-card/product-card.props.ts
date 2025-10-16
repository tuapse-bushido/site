import { ProductCard } from '@/types/db/composite/product-card';
import { AddonEntry } from '@/types';

export type ProductCardProps =
  | {
      variant: 'main';
      product: ProductCard;
    }
  | {
      variant: 'cart';
      product: ProductCard;
    }
  | {
      variant: 'page';
      product: ProductCard;
    }
  | {
      variant: 'cart-addon';
      product: AddonEntry;
    };
