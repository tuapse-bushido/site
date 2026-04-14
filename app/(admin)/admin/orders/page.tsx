import { JSX, Suspense } from 'react';
import { OrdersScreen } from 'modules/admin/orders';

type Params = { from?: string; to?: string };
type Props = {
  searchParams: Promise<Params>;
};

export default async function OrdersPage({ searchParams }: Props): Promise<JSX.Element> {
  const params = searchParams.then(
    (sp): Params => ({ ...(sp.from ? { from: sp.from } : {}), ...(sp.to ? { to: sp.to } : {}) }),
  );

  return (
    <Suspense fallback={<div>loading</div>}>
      <OrdersScreen params={params} />
    </Suspense>
  );
}
