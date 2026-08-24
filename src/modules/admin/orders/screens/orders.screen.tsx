import { JSX } from 'react';
import { ordersRepo } from 'modules/admin/orders/repository';
import { OrdersDateFilter } from '../features/orders-date-filter';
import { getSafeDateRange, mapOrdersToTable } from 'modules/admin/orders/utils';
import { PageContainer } from 'modules/admin/shared/ui/page-container';
import { OrdersTable } from 'modules/admin/orders/widgets/orders-table';

type Props = {
  params: Promise<{
    from?: string;
    to?: string;
  }>;
};

export const OrdersScreen = async ({ params }: Props): Promise<JSX.Element | null> => {
  const { from: fromParam, to: toParam } = await params;
  const { from, to } = getSafeDateRange(fromParam, toParam);

  const orders = await ordersRepo.getFullOrdersByRange(from, to);

  if (!orders.ok) return null;

  return (
    <PageContainer title="Заказы" filters={<OrdersDateFilter />}>
      <OrdersTable data={mapOrdersToTable(orders.data)} />
    </PageContainer>
  );
};
