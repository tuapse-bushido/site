export async function sendOrderToSocketServer(payload: unknown): Promise<void> {
  try {
    await fetch('http://127.0.0.1:3001', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (error) {
    console.error('Socket notification failed:', error);
  }
}
