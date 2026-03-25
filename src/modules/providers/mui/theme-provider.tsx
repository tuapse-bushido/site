'use client';

import { theme } from './theme';
import React, { JSX } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { AppRouterCacheProvider } from '@mui/material-nextjs/v15-appRouter';

export function AdminThemeProvider({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <AppRouterCacheProvider>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </AppRouterCacheProvider>
  );
}
