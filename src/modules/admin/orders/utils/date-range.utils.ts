import dayjs from 'dayjs';

export const getSafeDateRange = (
  fromStr?: string,
  toStr?: string,
): {
  from: Date;
  to: Date;
} => {
  const dateFrom = fromStr && dayjs(fromStr).isValid() ? dayjs(fromStr) : dayjs();
  const dateTo = toStr && dayjs(toStr).isValid() ? dayjs(toStr) : dayjs();

  return {
    from: dateFrom.startOf('day').toDate(),
    to: dateTo.endOf('day').toDate(),
  };
};
