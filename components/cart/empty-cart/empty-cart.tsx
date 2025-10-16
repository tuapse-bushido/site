import { JSX } from 'react';
import Image from 'next/image';
import styles from './empty-cart.module.scss';
import { Divider } from '@/components/cart/divider/divider';

export const EmptyCart = (): JSX.Element => {
  return (
    <>
      <Divider direction={'horizontal'} />
      <div className={styles.emptyImageWrapper}>
        <Image
          className={styles.emptyImage}
          alt={'Ваша корзина пуста'}
          src={'/cart/empty.png'}
          width={300}
          height={250}
          sizes="(max-width: 576px) 100vw, 300px"
        />

        <p className={styles.emptyText}>
          Ваша корзина совсем пуста, самое время зайти в меню и выбрать что-то вкусненькое!
        </p>
      </div>
    </>
  );
};
