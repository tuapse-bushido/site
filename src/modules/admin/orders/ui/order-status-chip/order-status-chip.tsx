import { JSX } from 'react';
import { MuiChip } from 'modules/admin/shared/ui/mui';
import { OrderStatus } from 'modules/admin/orders/entities';

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; color: 'info' | 'warning' | 'success' | 'error' | 'primary' }
> = {
  new: {
    label: 'Новый',
    color: 'info',
  },
  in_progress: {
    label: 'В работе',
    color: 'warning',
  },
  sent: {
    label: 'Отправлен',
    color: 'primary',
  },
  done: {
    label: 'Завершен',
    color: 'success',
  },
  canceled: {
    label: 'Отменен',
    color: 'error',
  },
};

export const OrderStatusChip = ({ status }: { status: string }): JSX.Element => {
  const config = STATUS_CONFIG[status as OrderStatus] || { label: status, color: 'default' };

  return <MuiChip label={config.label} color={config.color} size="small" sx={{ fontWeight: 500, minWidth: 90 }} />;
};
