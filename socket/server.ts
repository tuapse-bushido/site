import http from 'http';
import { Server } from 'socket.io';

import dotenv from 'dotenv';

dotenv.config({ path: 'socket/.env' });

const PORT = Number(process.env.SOCKET_PORT || 3001);
const HOST = process.env.SOCKET_HOST || '0.0.0.0';

const server = http.createServer();

const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket): void => {
  console.log('🟢 Connected:', socket.id);

  socket.on('newOrder', (data): void => {
    io.emit('admin:order:new', data);
  });

  socket.on('disconnect', (): void => {
    console.log('❌ Disconnected:', socket.id);
  });
});

server.listen(PORT, HOST, (): void => {
  console.log(`🚀 Socket.IO running on ${HOST}:${PORT}`);
});
