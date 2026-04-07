'use client';

import clsx from 'clsx';
import { CheckoutForm } from '../ui';
import { JSX, useState } from 'react';
import { redirect } from 'next/navigation';
import styles from './checkout-screens.module.scss';
import { useAppSelector } from 'modules/client/redux';
import { CartItems } from 'modules/client/cart/model/cart-state.types';

export const CheckoutScreens = (): JSX.Element => {
  const items = useAppSelector((state): CartItems => state.cart.items);
  const hasItems = Object.keys(items).length > 0;

  const [orderType, setOrderType] = useState<'delivery' | 'pickup'>('delivery');

  const handlerChangeTypeOrder = (type: 'delivery' | 'pickup'): void => {
    setOrderType(type);
  };

  if (!hasItems) {
    redirect('/cart');
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <button
          className={clsx('btn', orderType === 'delivery' ? 'btnPrimary' : 'btnSecondary', styles.checkoutBtn)}
          type="button"
          onClick={(): void => handlerChangeTypeOrder('delivery')}
        >
          Доставка
        </button>

        <button
          className={clsx('btn', orderType === 'pickup' ? 'btnPrimary' : 'btnSecondary', styles.checkoutBtn)}
          type="button"
          onClick={(): void => handlerChangeTypeOrder('pickup')}
        >
          Самовывоз
        </button>
      </div>

      <CheckoutForm orderType={orderType} />
    </div>
  );
};
