import { JSX, ReactNode } from 'react';
import { ClientLayout } from 'modules/layout/client';

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return <ClientLayout>{children}</ClientLayout>;
}
