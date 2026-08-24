import 'shared/styles/global.scss';
import React, { JSX } from 'react';
import { Inter } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  weight: ['400', '500', '700'],
  subsets: ['cyrillic'],
  display: 'swap',
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="ru" data-scroll-behavior="smooth">
      <body className={`${inter.variable}`}>{children}</body>
    </html>
  );
}
