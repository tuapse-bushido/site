import { Dispatch, SetStateAction, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { useRouter, useSearchParams } from 'next/navigation';

type Returns = {
  from: dayjs.Dayjs | null;
  setFrom: Dispatch<SetStateAction<dayjs.Dayjs | null>>;
  to: dayjs.Dayjs | null;
  setTo: Dispatch<SetStateAction<dayjs.Dayjs | null>>;
  isTodayActive: boolean;
  isYesterdayActive: boolean | '' | null;
  applyFilter: () => void;
  handleFilterToday: () => void;
  handleFilterYesterday: () => void;
  searchParamsKey: string;
};

export const useOrdersDateFilter = (): Returns => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const fromParam = searchParams.get('from');
  const toParam = searchParams.get('to');

  // Стейт для календарей
  const [from, setFrom] = useState<Dayjs | null>(fromParam ? dayjs(fromParam) : dayjs().startOf('day'));
  const [to, setTo] = useState<Dayjs | null>(toParam ? dayjs(toParam) : dayjs().endOf('day'));

  // Логика подсветки кнопок
  const isTodayActive = fromParam ? dayjs(fromParam).isSame(dayjs(), 'day') : true;
  const isYesterdayActive = fromParam && dayjs(fromParam).isSame(dayjs().subtract(1, 'day'), 'day');

  // Общая функция для смены URL
  const updateUrl = (newFrom: Dayjs | null, newTo: Dayjs | null): void => {
    const params = new URLSearchParams(searchParams.toString());
    if (newFrom) params.set('from', newFrom.startOf('day').toISOString());
    if (newTo) params.set('to', newTo.endOf('day').toISOString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const applyFilter = (): void => updateUrl(from, to);

  const handleFilterToday = (): void => {
    const start = dayjs().startOf('day');
    const end = dayjs().endOf('day');
    setFrom(start);
    setTo(end);
    updateUrl(start, end);
  };

  const handleFilterYesterday = (): void => {
    const yesterday = dayjs().subtract(1, 'day');
    const start = yesterday.startOf('day');
    const end = yesterday.endOf('day');
    setFrom(start);
    setTo(end);
    updateUrl(start, end);
  };

  return {
    from,
    setFrom,
    to,
    setTo,
    isTodayActive,
    isYesterdayActive,
    applyFilter,
    handleFilterToday,
    handleFilterYesterday,
    searchParamsKey: searchParams.toString(),
  };
};
