import { io, Socket } from 'socket.io-client';
import { CreateOrderPayload } from 'modules/order/model';

export async function sendOrderToSocketServer(payload: CreateOrderPayload): Promise<void> {
  const socket = io(process.env.WS_SERVER_URL!, {
    autoConnect: false,
  });

  const connectSocket = (s: Socket): Promise<void> =>
    new Promise<void>((resolve, reject): void => {
      const handleConnect = (): void => {
        s.off('connect_error', handleError);
        resolve();
      };
      const handleError = (error: Error): void => {
        s.off('connect', handleConnect);
        reject(error);
      };
      s.once('connect', handleConnect);
      s.once('connect_error', handleError);
      s.connect();
    });

  await connectSocket(socket);

  socket.emit('newOrder', payload);

  socket.disconnect();
}
