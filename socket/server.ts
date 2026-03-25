import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config({ path: 'socket/.env' });

const PORT = Number(process.env.SOCKET_PORT || 3001);
const HOST = process.env.SOCKET_HOST || '0.0.0.0';

// 1. Добавляем обработку HTTP запросов
const server = http.createServer((req, res) => {
  console.log(`[HTTP] ${req.method} ${req.url}`); // ЛОГ ДЛЯ ПРОВЕРКИ

  if (req.method === 'POST') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        console.log('📢 Рассылаю сокет всем админам!');
        io.emit('order:new', data);

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'ok' }));
      } catch (e) {
        console.error('Ошибка парсинга JSON');
        res.writeHead(400);
        res.end();
      }
    });
    return;
  }
  res.writeHead(404);
  res.end();
});
const io = new Server(server, {
  cors: { origin: '*' },
});

io.on('connection', (socket) => {
  console.log('🟢 Connected:', socket.id);

  socket.on('order:create', (data) => {
    console.log('Create order via Socket');
    io.emit('order:new', data);
  });

  socket.on('disconnect', (reason) => {
    console.log('❌ Disconnected:', socket.id, 'reason:', reason);
  });
});

server.listen(PORT, HOST, () => {
  console.log(`🚀 Socket.IO & HTTP Trigger running on ${HOST}:${PORT}`);
});
