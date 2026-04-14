import { JSX } from 'react';
import styles from './cart-list.module.scss';
import { CartProductCard, Divider } from 'modules/client/cart/ui';
import { Addons, CartCardViewModel, CartItem } from 'modules/client/cart/model/cart-state.types';
import { AddonProduct } from 'modules/client/entities';

export const CartList = ({
  products,
  addons,
  prod,
  add,
}: {
  products: CartCardViewModel[];
  addons: CartCardViewModel[];
  prod: CartItem[];
  add: Addons;
}): JSX.Element => {
  return (
    <>
      <div className={styles.list}>
        {products.map(
          (item): JSX.Element => (
            <CartProductCard key={item.id} product={item} prod={prod.find((p): boolean => p.id === item.id)!} />
          ),
        )}
      </div>

      {addons.length > 0 && (
        <>
          <Divider />
          <div className={styles.list}>
            {addons.map(
              (addon): JSX.Element => (
                <CartProductCard key={`addon-${addon.id}`} product={addon} add={add[addon.id]} />
              ),
            )}
          </div>
        </>
      )}
    </>
  );
};
