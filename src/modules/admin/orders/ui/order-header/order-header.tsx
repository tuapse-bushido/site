import { JSX } from 'react';
import { MuiBox, MuiStack, MuiTypography } from 'modules/admin/shared/ui/mui';
import { OrderStatus } from 'modules/admin/orders/entities';
import { OrderStatusChip } from 'modules/admin/orders/ui/order-status-chip';

type Props = {
  orderNumber: string;
  date: string;
  status: OrderStatus;
};

export const OrderHeader = ({ orderNumber, date, status }: Props): JSX.Element => {
  return (
    <MuiBox>
      <MuiStack direction="row" alignItems="center" spacing={2}>
        <MuiTypography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
          Заказ #{orderNumber}
        </MuiTypography>

        <OrderStatusChip status={status} />
      </MuiStack>

      <MuiTypography variant="body1" sx={{ color: 'text.secondary', mt: 0.5, fontWeight: 500 }}>
        Дата заказа: {date}
      </MuiTypography>
    </MuiBox>
  );
};
