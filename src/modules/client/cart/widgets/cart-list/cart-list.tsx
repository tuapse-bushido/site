import { JSX } from 'react';
import styles from './cart-list.module.scss';
import { CartProductCard, Divider } from 'modules/client/cart/ui';
import { CartCardViewModel } from 'modules/client/cart/model/cart-state.types';

export const CartList = ({
  products,
  addons,
}: {
  products: CartCardViewModel[];
  addons: CartCardViewModel[];
}): JSX.Element => {
  return (
    <>
      <div className={styles.list}>
        {products.map(
          (item): JSX.Element => (
            <CartProductCard key={item.id} product={item} />
          ),
        )}
      </div>

      {addons.length > 0 && (
        <>
          <Divider />
          <div className={styles.list}>
            {addons.map(
              (addon): JSX.Element => (
                <CartProductCard key={`addon-${addon.id}`} product={addon} />
              ),
            )}
          </div>
        </>
      )}
    </>
  );
};
