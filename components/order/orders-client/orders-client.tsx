'use client';

import { JSX, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { io } from 'socket.io-client';
import { OrdersList } from '@/components/order/orders-list/orders-list';
import { FullOrder } from '@/types/db/composite/full-order';

export default function OrdersClient({
  initialOrders,
  date,
}: {
  initialOrders: FullOrder[];
  date: string;
}): JSX.Element {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const socket = io('http://localhost:3001');

    socket.on('admin:order:new', (): void => {
      console.log('order new');
      startTransition((): void => {
        router.refresh();
      });
    });

    return (): void => {
      socket.disconnect();
    };
  }, [router]);

  return (
    <div>
      <h1>Заказы за {date}</h1>

      <OrdersList orders={initialOrders} />

      {isPending && <p>Обновление...</p>}
    </div>
  );
}
