'use client';

import { JSX, useState } from 'react';
import { setStatusOrderAction } from '../api';
import { CancelIcon, CheckIcon, DoneIcon } from './icons';
import { OrderStatus } from 'modules/admin/orders/entities';
import { MuiButton, MuiCircularProgress, MuiStack, MuiSvgIcon } from 'modules/admin/shared/ui/mui';

type Props = {
  orderId: number;
  currentStatus: OrderStatus;
};

export const OrderDetailsAction = ({ orderId, currentStatus }: Props): JSX.Element => {
  const [loading, setLoading] = useState<string | null>(null);

  const handleStatusChange = async (newStatus: OrderStatus): Promise<void> => {
    setLoading(newStatus);
    try {
      await setStatusOrderAction(orderId, newStatus);
    } catch (error) {
      console.error('Ошибка при смене статуса', error);
    } finally {
      setLoading(null);
    }
  };
  return (
    <MuiStack direction={'row'} alignItems={'center'} spacing={3}>
      <MuiButton
        sx={{ width: 130, height: 48 }}
        variant="contained"
        color="primary" // Стандартный синий
        startIcon={
          loading === 'in_progress' ? (
            <MuiCircularProgress size={20} color="inherit" />
          ) : (
            <MuiSvgIcon component={CheckIcon} inheritViewBox />
          )
        }
        disabled={!!loading || currentStatus !== 'new'}
        onClick={(): Promise<void> => handleStatusChange('in_progress')}
      >
        Принять
      </MuiButton>

      <MuiButton
        sx={{ width: 130, height: 48 }}
        variant="contained"
        color="success" // Стандартный зеленый
        startIcon={
          loading === 'done' ? (
            <MuiCircularProgress size={20} color="inherit" />
          ) : (
            <MuiSvgIcon component={DoneIcon} inheritViewBox />
          )
        }
        disabled={!!loading || currentStatus !== 'in_progress'}
        onClick={(): Promise<void> => handleStatusChange('done')}
      >
        Готов
      </MuiButton>

      <MuiButton
        sx={{ width: 130, height: 48 }}
        variant="outlined"
        color="error" // Стандартный красный (контурный)
        startIcon={
          loading === 'canceled' ? (
            <MuiCircularProgress size={20} color="inherit" />
          ) : (
            <MuiSvgIcon component={CancelIcon} inheritViewBox />
          )
        }
        disabled={!!loading || ['done', 'canceled'].includes(currentStatus)}
        onClick={(): Promise<void> => handleStatusChange('canceled')}
      >
        Отмена
      </MuiButton>
    </MuiStack>
  );
};
