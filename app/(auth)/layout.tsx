import { Roboto } from 'next/font/google';
import '@/styles/global.scss';
import React, { JSX } from 'react';
import '@/src/shared/styles/global.scss';

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-roboto',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="ru">
      <body className={roboto.variable}>{children}</body>
    </html>
  );
}
