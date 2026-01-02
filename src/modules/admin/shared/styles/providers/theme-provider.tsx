'use client';

import React, { JSX } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { theme } from '@/src/modules/admin/shared/styles/theme/';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export function AdminThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>;
    </AppRouterCacheProvider>
  );
}
