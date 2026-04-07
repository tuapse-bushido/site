import { AddonEntry, DivProps } from 'src/old/types';
import { ProductCard } from 'modules/client/catalog/entities/product-card.entity';

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
