'use client';

import { useEffect, useRef } from 'react'; // Добавили useRef
import { revalidateOrders } from '../utils';
import { useRouter } from 'next/navigation';
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const OrdersAutoUpdate = (): null => {
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/new-order-notification.wav');
    audioRef.current.volume = 1;

    if (!socket) {
      socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://127.0.0.1:3001', {
        autoConnect: true,
        reconnection: true,
      });
    }

    function onNewOrder(): void {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e): void => console.error('Sound play failed:', e));
      }

      revalidateOrders().then((): void => {
        router.refresh();
      });
    }

    socket.on('order:new', onNewOrder);

    return (): void => {
      socket?.off('order:new', onNewOrder);
    };
  }, [router]);

  return null;
};
