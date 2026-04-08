import React, { JSX } from 'react';
import { AdminLayout } from 'modules/layout/admin';
import { AdminThemeProvider } from 'modules/providers';
import { OrdersAutoUpdate } from 'modules/admin/orders/utils/orders-auto-update/orders-auto-update';

export default function AdminRootLayout({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <AdminThemeProvider>
      <AdminLayout>{children}</AdminLayout>
      <OrdersAutoUpdate />
    </AdminThemeProvider>
  );
}
