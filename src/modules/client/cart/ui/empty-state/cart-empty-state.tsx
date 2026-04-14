import { JSX } from 'react';
import { AppImage } from 'shared/ui/app-image';
import styles from './cart-empty-state.module.scss';

export const CartEmptyState = (): JSX.Element => {
  return (
    <div className={styles.page}>
      <AppImage src={'/cart/empty.png'} alt={'Ваша корзина пуста'} imageProps={{ width: 300, height: 250 }} />

      <p className={styles.text}>Ваша корзина совсем пуста, самое время зайти в меню и выбрать что-то вкусненькое!</p>
    </div>
  );
};
