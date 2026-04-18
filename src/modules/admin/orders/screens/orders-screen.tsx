import { JSX } from 'react';
import { ordersRepo } from 'modules/admin/orders/repository';
import { OrdersDateFilter } from '../features/orders-date-filter';
import { orderColumns, TableComponent } from 'modules/admin/shared/ui/table';
import { getSafeDateRange, mapOrdersToTable } from 'modules/admin/orders/utils';
import { MuiDivider, MuiStack, MuiTypography } from 'modules/admin/shared/ui/mui';

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
    <MuiStack direction={'column'} gap={4} sx={{ height: '100%' }}>
      <MuiTypography variant={'h1'}>Заказы</MuiTypography>
      <MuiDivider />
      <OrdersDateFilter />
      <TableComponent columns={orderColumns} data={mapOrdersToTable(orders.data)} slug={'orders'} />
    </MuiStack>
  );
};
