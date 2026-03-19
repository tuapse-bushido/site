export const sendSmsCode = async (phone: string, code: string): Promise<void> => {
  const url = new URL(process.env.SMS_PILOT_SEND);

  const message = `Для подтверждения заказа, введите код: ${code}`;

  url.searchParams.append('send', message);
  url.searchParams.append('to', phone);

  const response = await fetch(url);
  const data = await response.json();

  console.log(data);
};
