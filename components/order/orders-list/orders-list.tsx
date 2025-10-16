import { JSX } from 'react';
import { FullOrder } from '@/types/db/composite/full-order';
import { OrderItem } from '@/components/order/order-item/order-item';
import { useRouter } from 'next/navigation';
import styles from './order-list.module.scss';

export const OrdersList = ({ orders }: { orders: FullOrder[] }): JSX.Element => {
  const router = useRouter();

  return (
    <div className={styles.list}>
      <div className={styles.header}>
        <span>№</span>
        <span>Номер заказа</span>
        <span>Время заказа</span>
        <span>Имя</span>
        <span>Телефон</span>
        <span>Адрес</span>
        <span>Статус</span>
        <span>Стоимость</span>
      </div>

      {orders.map(
        (order, index): JSX.Element => (
          <OrderItem
            className={styles.row}
            key={order.id}
            index={index}
            order={order}
            onClick={(): void => router.push(`/admin/orders/${order.id}`)}
          />
        ),
      )}
    </div>
  );
};
