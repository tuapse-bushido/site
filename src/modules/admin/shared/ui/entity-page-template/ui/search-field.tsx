import { JSX } from 'react';
import { MuiTextField } from 'modules/admin/shared/ui/mui';

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export const SearchField = ({ value, onChange }: Props): JSX.Element => {
  return (
    <MuiTextField
      value={value}
      onChange={(e): void => onChange(e.target.value)}
      placeholder="Поиск..."
      size="small"
      sx={{
        width: { xs: '100%' },
      }}
    />
  );
};
