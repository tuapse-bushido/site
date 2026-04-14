import { JSX, Suspense } from 'react';
import { ordersRepo } from 'modules/admin/orders/repository';
import { OrdersDateFilter } from '../features/orders-date-filter';
import { orderColumns, TableComponent } from 'modules/admin/shared/ui/table';
import { getSafeDateRange, mapOrdersToTable } from 'modules/admin/orders/utils';
import { MuiBox, MuiDivider, MuiTypography } from 'modules/admin/shared/ui/mui';

type Props = {
  params: Promise<{
    from?: string;
    to?: string;
  }>;
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    height: '100%',
  },
};

export const OrdersScreen = async ({ params }: Props): Promise<JSX.Element | null> => {
  const { from: fromParam, to: toParam } = await params;

  const { from, to } = getSafeDateRange(fromParam, toParam);

  const orders = await ordersRepo.getFullOrdersByRange(from, to);

  if (!orders.ok) return null;

  return (
    <MuiBox sx={styles.container}>
      <MuiTypography variant={'h1'}>Заказы</MuiTypography>
      <MuiDivider />
      <OrdersDateFilter />
      <Suspense fallback={<div>loading</div>}>
        <TableComponent columns={orderColumns} data={mapOrdersToTable(orders.data)} slug={'orders'} />
      </Suspense>
    </MuiBox>
  );
};
