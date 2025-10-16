import { Server } from 'socket.io';

const io = new Server(3001, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket): void => {
  socket.on('newOrder', (data): void => {
    io.emit('admin:order:new', data);
  });

  socket.on('disconnect', (): void => {
    console.log('❌ Отключился:', socket.id);
  });
});
