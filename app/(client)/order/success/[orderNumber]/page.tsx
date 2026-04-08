import { JSX, Suspense } from 'react';
import { OrderGetNumber } from 'modules/order/screens/order-get-number';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { orderNumber: string } }): Promise<Metadata> {
  return {
    title: `Заказ №${params.orderNumber} принят`,
    description: 'Ваш заказ в Бушидо успешно оформлен и передан на кухню.',
    robots: {
      index: false,
      follow: false,
      nocache: true,
    },
  };
}

export default async function SuccessPage({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}): Promise<JSX.Element> {
  return (
    <Suspense fallback={'loading'}>
      <OrderGetNumber params={params} />
    </Suspense>
  );
}
