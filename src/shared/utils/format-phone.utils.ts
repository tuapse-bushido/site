export const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').replace(/^8/, '7').slice(0, 11);

  const parts = ['+7'];

  if (digits.length > 1) parts.push(' ', digits.slice(1, 4));
  if (digits.length > 4) parts.push(' ', digits.slice(4, 7));
  if (digits.length > 7) parts.push('-', digits.slice(7, 9));
  if (digits.length > 9) parts.push('-', digits.slice(9, 11));

  return parts.join('');
};
