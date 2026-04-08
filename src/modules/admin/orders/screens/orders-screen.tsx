import { JSX, Suspense } from 'react';
import { Divider, Typography } from '@mui/material';
import { TableComponent } from 'modules/admin/shared/ui/table/table';
import { orderColumns } from 'modules/admin/shared/ui/table/table-columns';
import { getFullOrdersByRange } from 'modules/admin/orders/repository/orders.repository';
import { OrdersAutoUpdate } from 'modules/admin/orders/utils/orders-auto-update/orders-auto-update';
import styles from './orders-screen.module.scss';
import { OrdersDateFilter } from 'modules/admin/orders/features/orders-date-filter/order-date-filter';

type Props = {
  params: Promise<{
    from?: string;
    to?: string;
  }>;
};

export const OrdersScreen = async ({ params }: Props): Promise<JSX.Element | null> => {
  const { from: fromParam, to: toParam } = await params;

  let from: Date;
  let to: Date;

  if (fromParam && toParam) {
    from = new Date(fromParam);
    to = new Date(toParam);
  } else {
    const now = new Date();
    from = new Date(now);
    from.setHours(0, 0, 0, 0);

    to = new Date(now);
    to.setHours(23, 59, 59, 999);
  }

  const orders = await getFullOrdersByRange(from, to);

  if (!orders.ok) return null;

  return (
    <div className={styles.screen}>
      {/*<OrdersAutoUpdate />*/}
      <Typography variant={'h1'}>Заказы</Typography>
      <Divider />
      <OrdersDateFilter />
      <Suspense fallback={<div>loading</div>}>
        <TableComponent columns={orderColumns} data={orders.data} slug={'orders'} />
      </Suspense>
    </div>
  );
};
