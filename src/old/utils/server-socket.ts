import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getServerSocket = (): Promise<Socket> => {
  return new Promise((resolve, reject): void => {
    if (socket && socket.connected) return resolve(socket);

    socket = io('http://192.168.1.100:3001', {
      transports: ['websocket'],
      reconnection: false,
    });

    socket.on('connect', (): void => {
      resolve(socket!);
    });

    socket.on('connect_error', (err): void => {
      console.error('❌ Ошибка соединения с WS:', err.message);
      reject(err);
    });
  });
};
