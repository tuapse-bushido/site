import clsx from 'clsx';
import { JSX } from 'react';
import { Divider } from 'modules/client/cart/ui';
import styles from './order-summary.module.scss';

export const OrderSummary = ({ totalPrice }: { totalPrice: number }): JSX.Element => {
  return (
    <>
      <Divider />
      <section className={styles.section}>
        <h2 className={clsx(styles.font, styles.title)}>Стоимость заказа:</h2>

        <div className={styles.rows}>
          <span className={clsx(styles.font, styles.label)}>Товары</span>
          <span className={clsx(styles.font)}>{totalPrice} ₽</span>
        </div>

        <div className={styles.rows}>
          <span className={clsx(styles.font, styles.label)}>Доставка</span>
          <span className={clsx(styles.font)}>стоимость рассчитает менеджер</span>
        </div>

        <footer className={clsx(styles.total, styles.rows)}>
          <span>ИТОГО</span>
          <span>{totalPrice} ₽</span>
        </footer>
      </section>
    </>
  );
};
