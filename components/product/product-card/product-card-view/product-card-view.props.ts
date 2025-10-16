import { ProductCard } from '@/types/db/composite/product-card';
import { AddonEntry, DivProps } from '@/types';

export type ProductCardViewProps =
  | (DivProps & {
      type: 'cart' | 'main' | 'page';
      product_type: 'product';
      product: ProductCard;
    })
  | (DivProps & {
      type: 'cart' | 'cart-addon';
      product_type: 'addon';
      product: AddonEntry;
    });
