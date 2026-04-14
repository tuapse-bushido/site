import { JSX, Suspense } from 'react';
import { OrderGetNumber } from 'modules/order/screens/order-get-number';

import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ orderNumber: string }> }): Promise<Metadata> {
  const { orderNumber } = await params;

  return {
    title: `Заказ №${orderNumber} принят`,
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
