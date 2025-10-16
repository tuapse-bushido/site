import { JSX } from 'react';
import { OrderItemProps } from '@/components/order/order-item/order-item.props';
import styles from './order-item.module.scss';
import clsx from 'clsx';

export const OrderItem = ({ index, order, className, ...props }: OrderItemProps): JSX.Element => {
  const date = new Date(order.created_at);
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);

  return (
    <div className={clsx(styles.order, className)} {...props}>
      <span>{index + 1}</span>
      <span>{order.order_number}</span>
      <span>{time}</span>
      <span>{order.customer_name}</span>
      <span>{order.customer_phone}</span>
      <span>{order.address_city}</span>
      <span>{order.status}</span>
      <span>{order.total_price}</span>
    </div>
  );
};
