import { Inter, Roboto } from 'next/font/google';
import '@/styles/global.scss';
import React, { JSX } from 'react';
import { BottomNav } from '@/components/bottom-nav/bottom-nav';
import { Header } from '@/components/header/header';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${roboto.variable}`}>
        <Header />
        {children}
        <BottomNav />
      </body>
    </html>
  );
}
