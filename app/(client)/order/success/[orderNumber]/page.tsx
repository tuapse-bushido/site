import { JSX, Suspense } from 'react';
import { OrderGetNumber } from 'modules/order/screens/order-get-number';

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
