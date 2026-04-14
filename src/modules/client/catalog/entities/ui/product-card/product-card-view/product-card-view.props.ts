import { ProductCard } from 'modules/client/entities';

// export type ProductCardViewProps =
//   | (DivProps & {
//       type: 'cart' | 'main' | 'page';
//       product_type: 'product';
//       product: ProductCard;
//     })
//   | (DivProps & {
//       type: 'cart' | 'cart-addon';
//       product_type: 'addon';
//       product: AddonEntry;
//     });

export type ProductCardViewProps = {
  product: ProductCard;
};
