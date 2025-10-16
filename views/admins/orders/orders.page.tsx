import OrdersClient from '@/components/order/orders-client/orders-client';
import { JSX } from 'react';
import { getFullOrdersByDate } from '@/libs/db/orders/orders.query';

export async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}): Promise<JSX.Element | null> {
  const date = (await searchParams).date ?? new Date().toISOString().slice(0, 10);
  const orders = await getFullOrdersByDate(date);

  if (!orders.success) return null;

  return (
    <>
      <div>Привет</div>
      <OrdersClient initialOrders={orders.data} date={date} />
    </>
  );
}
