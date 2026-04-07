export const formatOrderNumber = (counter: number): string => {
  const now = new Date();
  const dd = String(now.getDate()).padStart(2, '0');
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const yy = String(now.getFullYear()).slice(-2);
  const count = String(counter).padStart(3, '0');

  return `${dd}${mm}${yy}-${count}`;
};
