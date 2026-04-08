import { JSX } from 'react';
import { MuiBox, MuiTextField } from 'shared/ui/mui';

type Props = {
  title: string | undefined;
  baseCount: number | undefined;
  divisor: number | undefined;
  showCountPercent: number | undefined;
};

export const GeneralInfo = ({ title, baseCount, divisor, showCountPercent }: Props): JSX.Element => {
  return (
    <MuiBox sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 2 }}>
      <MuiBox sx={{ gridColumn: 'span 2' }}>
        <MuiTextField
          fullWidth
          name={'title'}
          label="Название правила (для админа)"
          variant="outlined"
          defaultValue={title ?? ''}
        />
      </MuiBox>

      <MuiTextField
        name={'base_count'}
        label="Базовое количество"
        type="number"
        variant="outlined"
        defaultValue={baseCount ?? 1}
      />

      <MuiTextField
        name={'divisor'}
        label="Шаг выбора (делитель)"
        type="number"
        variant="outlined"
        defaultValue={divisor ?? 1}
      />

      <MuiBox sx={{ gridColumn: 'span 2' }}>
        <MuiTextField
          fullWidth
          name={'show_count_percent'}
          label="Процент отображения"
          type="number"
          variant="outlined"
          defaultValue={showCountPercent ?? 50}
        />
      </MuiBox>
    </MuiBox>
  );
};
