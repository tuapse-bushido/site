'use client';

import { JSX, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Button, Stack } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';

export const OrdersDateFilter = (): JSX.Element => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [from, setFrom] = useState<Dayjs | null>(
    searchParams.get('from') ? dayjs(searchParams.get('from')) : dayjs().startOf('day'),
  );
  const [to, setTo] = useState<Dayjs | null>(
    searchParams.get('to') ? dayjs(searchParams.get('to')) : dayjs().endOf('day'),
  );

  const applyFilter = (): void => {
    const params = new URLSearchParams(searchParams.toString());

    // Гарантируем начало и конец дня для корректного SQL фильтра
    if (from) params.set('from', from.startOf('day').toISOString());
    if (to) params.set('to', to.endOf('day').toISOString());

    router.push(`?${params.toString()}`);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
      <Stack direction="row" spacing={2} sx={{ mb: 2, mt: 2 }}>
        <DatePicker
          label="От"
          value={from}
          onChange={(val): void => setFrom(val)}
          {...(to ? { maxDate: to } : {})}
          slotProps={{ textField: { size: 'small' } }}
        />

        <DatePicker
          label="До"
          value={to}
          onChange={(val): void => setTo(val)}
          {...(from ? { minDate: from } : {})}
          slotProps={{ textField: { size: 'small' } }}
        />
        <Button
          variant="contained"
          onClick={applyFilter}
          // Дополнительная блокировка кнопки, если даты вдруг стали некорректны
          disabled={!!from && !!to && from.isAfter(to)}
        >
          Применить
        </Button>
      </Stack>
    </LocalizationProvider>
  );
};
