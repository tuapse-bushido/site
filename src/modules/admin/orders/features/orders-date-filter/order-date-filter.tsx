'use client';

import { JSX } from 'react';
import { useOrdersDateFilter } from './hooks';
import { DatePicker } from '@mui/x-date-pickers';
import { MuiButton, MuiStack } from 'modules/admin/shared/ui/mui';

export const OrdersDateFilter = (): JSX.Element => {
  const {
    from,
    setFrom,
    to,
    setTo,
    isTodayActive,
    isYesterdayActive,
    applyFilter,
    handleFilterToday,
    handleFilterYesterday,
    searchParamsKey,
  } = useOrdersDateFilter();

  return (
    <MuiStack key={searchParamsKey} direction="row" spacing={2} alignItems="center">
      <MuiStack direction="row" spacing={1}>
        <MuiButton size="small" variant={isTodayActive ? 'contained' : 'text'} onClick={handleFilterToday}>
          Сегодня
        </MuiButton>

        <MuiButton size="small" variant={isYesterdayActive ? 'contained' : 'text'} onClick={handleFilterYesterday}>
          Вчера
        </MuiButton>
      </MuiStack>

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

      <MuiButton variant="contained" onClick={applyFilter} disabled={!!from && !!to && from.isAfter(to)}>
        Применить
      </MuiButton>
    </MuiStack>
  );
};
