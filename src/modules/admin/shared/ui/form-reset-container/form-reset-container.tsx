'use client';

import { JSX, ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { MuiBox, MuiPaper } from 'modules/admin/shared/ui/mui';

type Props = {
  children: ReactNode;
};

export const FormResetContainer = ({ children }: Props): JSX.Element => {
  const pathname = usePathname();

  return (
    <MuiPaper sx={{ height: '100%', p: 4 }}>
      <MuiBox key={pathname} height="100%">
        {children}
      </MuiBox>
    </MuiPaper>
  );
};
