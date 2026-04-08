import 'shared/styles/global.scss';
import React, { JSX } from 'react';
import { Inter, Roboto } from 'next/font/google';

const inter = Inter({
  variable: '--font-inter',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const roboto = Roboto({
  weight: ['300', '400', '500', '600', '700'],
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
    <html lang="ru" data-scroll-behavior="smooth">
      <body className={`${inter.variable} ${roboto.variable}`}>{children}</body>
    </html>
  );
}
