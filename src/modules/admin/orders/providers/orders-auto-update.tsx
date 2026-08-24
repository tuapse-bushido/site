'use client';

import { useEffect, useRef } from 'react'; // Добавили useRef
import { revalidateOrders } from '../utils';
import { useRouter } from 'next/navigation';
import { io, ManagerOptions, SocketOptions } from 'socket.io-client';

const socketOptions: Partial<ManagerOptions & SocketOptions> = {
  path: '/socket.io',
  autoConnect: true,
  reconnection: true,
};

const getSocketUrl = (): string | undefined => {
  const configuredUrl = process.env.NEXT_PUBLIC_SOCKET_URL;
  if (configuredUrl) return configuredUrl;

  const localPort = process.env.NEXT_PUBLIC_SOCKET_PORT;
  if (!localPort) return undefined;

  return `${window.location.protocol}//${window.location.hostname}:${localPort}`;
};

export const OrdersAutoUpdate = (): null => {
  const router = useRouter();

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio('/sounds/new-order-notification.wav');
    audioRef.current.volume = 1;
    audioRef.current.preload = 'auto';

    const unlockAudio = (): void => {
      const audio = audioRef.current;
      if (!audio) return;

      audio.muted = true;
      audio
        .play()
        .then((): void => {
          audio.pause();
          audio.currentTime = 0;
          audio.muted = false;
        })
        .catch((error): void => console.warn('[Socket] Sound unlock failed:', error));
    };

    window.addEventListener('pointerdown', unlockAudio, { once: true });

    const socketUrl = getSocketUrl();
    const socket = socketUrl ? io(socketUrl, socketOptions) : io(socketOptions);

    socket.on('connect', (): void => {
      console.info('[Socket] Connected:', socket.id);
    });

    socket.on('connect_error', (error): void => {
      console.error('[Socket] Connection failed:', error.message);
    });

    function onNewOrder(): void {
      console.info('[Socket] New order received');

      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch((e): void => console.error('Sound play failed:', e));
      }

      revalidateOrders()
        .then((): void => router.refresh())
        .catch((error): void => console.error('[Socket] Orders refresh failed:', error));
    }

    socket.on('order:new', onNewOrder);

    return (): void => {
      window.removeEventListener('pointerdown', unlockAudio);
      socket.off('order:new', onNewOrder);
      socket.disconnect();
    };
  }, [router]);

  return null;
};
