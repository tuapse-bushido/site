import { JSX, Suspense } from 'react';
import { getOrderByOrderNumber } from 'modules/order/repository/order.repository';
import { OrderSuccessScreens } from 'modules/order/screens/order-success/order-success-screens';

export const OrderGetNumber = async ({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}): Promise<JSX.Element | null> => {
  const { orderNumber } = await params;

  const response = await getOrderByOrderNumber(orderNumber);
  if (!response.ok) return null;
  const order = response.data;

  return (
    <Suspense fallback={'loading'}>
      <OrderSuccessScreens orderNumber={orderNumber} totalPrice={order.total_price} />
    </Suspense>
  );
};
