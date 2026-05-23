import { JSX, ReactNode } from 'react';
import { MuiDivider, MuiStack, MuiTypography } from 'modules/admin/shared/ui/mui';

type Props = {
  title: string;
  actions?: ReactNode;
  filters?: ReactNode;
  children: ReactNode;
};

export const PageContainer = ({ title, actions, filters, children }: Props): JSX.Element => {
  return (
    <MuiStack height={'100%'} direction={'column'} gap={3} p={{ xs: 2, md: 4 }}>
      <MuiStack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" gap={2}>
        <MuiTypography variant="h4">{title}</MuiTypography>

        {actions && actions}
      </MuiStack>

      <MuiDivider />

      {filters && (
        <MuiStack gap={2} sx={{ width: '100%' }}>
          {filters}
        </MuiStack>
      )}

      {children}
    </MuiStack>
  );
};
