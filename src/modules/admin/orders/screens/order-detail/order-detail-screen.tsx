import { JSX } from 'react';
import { OrderInfo } from 'modules/admin/orders/ui/order-info/order-info';
import { OrderItemsTable } from 'modules/admin/orders/ui/order-items-table';
import { getOrderById } from 'modules/admin/orders/repository/orders.repository';

export const OrderDetailScreen = async ({
  params,
}: {
  params: Promise<{
    order_id: string;
  }>;
}): Promise<JSX.Element | null> => {
  const { order_id } = await params;

  const order = await getOrderById(Number(order_id));

  if (!order.ok) return null;

  const { products } = order.data;

  return (
    <>
      <OrderItemsTable items={products} />
      <OrderInfo order={order.data} />
    </>
  );
};
