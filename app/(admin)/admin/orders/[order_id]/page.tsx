import { JSX, Suspense } from 'react';
import { OrderDetailScreen } from 'modules/admin/orders/screens/order-detail/order-detail-screen';

type Props = {
  params: Promise<{
    order_id: string;
  }>;
};
export default async function OrderDetailPage({ params }: Props): Promise<JSX.Element | null> {
  return (
    <Suspense fallback={'loading...'}>
      <OrderDetailScreen params={params} />
    </Suspense>
  );
}
