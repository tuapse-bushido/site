'use client';

import { JSX, useMemo, useState } from 'react';
import { useAppSelector } from '@/libs/redux/hooks/hooks';
import { AddonEntry, CartItem, CartState } from '@/types';
import { ProductCard } from '@/components/product/product-card/product-card';
import { Divider } from '@/components/cart/divider/divider';
import styles from './cart-list.module.scss';
import { Button } from '@/components/ui/button/button';
import { getTotalPriceInCart } from '@/utils';
import { OrderSummary } from '../order-summary/order-summary';
import { Checkout } from '@/components/cart/checkout/checkout';

export const CartList = (): JSX.Element => {
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const cart = useAppSelector((state): CartState => state.cart);

  const items = useMemo((): CartItem[] => Object.values(cart.items), [cart.items]);
  const addons = useMemo((): AddonEntry[] => Object.values(cart.addons), [cart.addons]);

  const totalPrice = getTotalPriceInCart(cart);

  return (
    <>
      <div className={styles.section}>
        {items.map(
          (item): JSX.Element => (
            <ProductCard key={item.id} variant={'cart'} product={item} />
          ),
        )}
      </div>

      {addons.length > 0 && (
        <>
          <Divider direction={'vertical'} />
          <div className={styles.section}>
            {addons.map(
              (addon): JSX.Element => (
                <ProductCard key={`addon-${addon.addon_product.id}`} variant={'cart-addon'} product={addon} />
              ),
            )}
          </div>
        </>
      )}

      {!checkoutOpen ? (
        <>
          <Divider direction={'vertical'} />
          <OrderSummary totalPrice={totalPrice} />
          <Button label={`Оформить заказ`} type={'primary'} onClick={(): void => setCheckoutOpen(true)} />
        </>
      ) : (
        <>
          <Divider direction={'vertical'} />
          <Checkout />
        </>
      )}
    </>
  );
};
