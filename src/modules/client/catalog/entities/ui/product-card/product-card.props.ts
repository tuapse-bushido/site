import { AddonEntry } from 'src/old/types';
import { ProductCard } from 'modules/client/catalog/entities/product-card.entity';

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
