import { JSX } from 'react';
import { ordersRepo } from 'modules/admin/orders/repository';
import { OrdersDateFilter } from '../features/orders-date-filter';
import { getSafeDateRange, mapOrdersToTable } from 'modules/admin/orders/utils';
import { TableComponent } from 'modules/admin/shared/ui/entity-page-template/ui/table';
import { TABLE_CONFIG } from 'modules/admin/shared/ui/entity-page-template/model/table.config';
import { PageContainer } from 'modules/admin/shared/ui/page-container';

type Props = {
  params: Promise<{
    from?: string;
    to?: string;
  }>;
};

export const OrdersScreen = async ({ params }: Props): Promise<JSX.Element | null> => {
  const config = TABLE_CONFIG.orders;
  const { from: fromParam, to: toParam } = await params;

  const { from, to } = getSafeDateRange(fromParam, toParam);

  const orders = await ordersRepo.getFullOrdersByRange(from, to);

  if (!orders.ok) return null;

  return (
    <PageContainer title={config.label.plural} filters={<OrdersDateFilter />}>
      <TableComponent columns={config.columns} data={mapOrdersToTable(orders.data)} getRowHrefAction={''} />
    </PageContainer>
  );
};
