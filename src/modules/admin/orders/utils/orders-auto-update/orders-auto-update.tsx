'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { revalidateOrders } from 'modules/admin/orders/utils/orders-auto-update/action';

const socket = io('http://127.0.0.1:3001', {
  autoConnect: true,
});

export const OrdersAutoUpdate = (): null => {
  const router = useRouter();

  useEffect(() => {
    function onNewOrder(): void {
      console.log('New order received!');

      // 1. Вызываем серверный сброс кэша
      revalidateOrders().then((): void => {
        router.refresh();
      });
    }

    socket.on('order:new', onNewOrder);
    return (): void => {
      socket.off('order:new', onNewOrder);
    };
  }, [router]);

  return null;
};
