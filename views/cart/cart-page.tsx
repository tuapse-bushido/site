import { JSX } from 'react';
import Image from 'next/image';
import styles from './cart-page.module.scss';
import { CartPageClientWrapper } from '@/components/cart/cart-page-wrapper';

export const CartPage = (): JSX.Element => {
  return (
    <div className={styles.page}>
      <div className={styles.pageDeliveryImageWrapper}>
        <Image
          className={styles.deliveryImage}
          src="/cart/delivery.png"
          alt="Условия доставки"
          width={1000}
          height={425}
        />
      </div>

      <CartPageClientWrapper />
    </div>
  );
};
