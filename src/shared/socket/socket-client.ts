const socketUrl = process.env.WS_SERVER_URL || 'http://127.0.0.1:3001';

export async function sendOrderToSocketServer(payload: unknown): Promise<void> {
  try {
    await fetch(socketUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Socket notification failed:', error);
  }
}
