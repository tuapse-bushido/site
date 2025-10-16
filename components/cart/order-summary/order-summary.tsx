import { JSX } from 'react';
import { OrderSummaryProps } from '@/components/cart/order-summary/order-summary.props';
import styles from './order-summary.module.scss';
import clsx from 'clsx';

export const OrderSummary = ({ totalPrice }: OrderSummaryProps): JSX.Element => {
  return (
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
  );
};
