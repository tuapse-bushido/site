import { JSX } from 'react';
import styles from './cart-page.module.scss';
import { CartContent } from 'modules/client/cart/widgets';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Корзина',
  description: 'Оформление заказа в кафе Бушидо Туапсе',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CartPage(): JSX.Element {
  return (
    <div className={styles.page}>
      <CartContent />
    </div>
  );
}
