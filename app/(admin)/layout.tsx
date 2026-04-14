import React, { JSX } from 'react';
import { AdminLayout } from 'modules/layout/admin';
import { AdminThemeProvider } from 'modules/providers';
import { OrdersAutoUpdate } from 'modules/admin/orders/providers';

export default function AdminRootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <AdminThemeProvider>
      <OrdersAutoUpdate />
      <AdminLayout>{children}</AdminLayout>
    </AdminThemeProvider>
  );
}
