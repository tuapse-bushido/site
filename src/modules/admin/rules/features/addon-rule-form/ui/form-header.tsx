'use client';

import { JSX, useState } from 'react';
import { MuiBox, MuiSwitch, MuiTypography } from 'shared/ui/mui';

type Props = {
  title: string | undefined;
  isActive: boolean | undefined;
};

export const FormHeader = ({ title, isActive }: Props): JSX.Element => {
  const [checked, setChecked] = useState(isActive ?? false);

  return (
    <MuiBox sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <MuiTypography variant="h5" fontWeight={600}>
        {title ? `Редактирование: ${title}` : `Новое правило`}
      </MuiTypography>

      <MuiBox sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <input type="hidden" name="is_active" value={String(checked)} />
        <MuiSwitch checked={checked} onChange={(e): void => setChecked(e.target.checked)} />
        <MuiTypography variant="body2" sx={{ cursor: 'pointer', userSelect: 'none' }}>
          Активно
        </MuiTypography>
      </MuiBox>
    </MuiBox>
  );
};
