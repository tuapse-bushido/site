import { Inter, Roboto } from 'next/font/google';
import '@/styles/global.scss';
import React, { JSX } from 'react';
import { ClientLayout } from '@/layouts/client-layout/client-layout';
import { Metadata, Viewport } from 'next';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const roboto = Roboto({
  variable: '--font-roboto',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Bushido — суши и роллы с доставкой в Сочи',
    template: '%s | Bushido',
  },
  description:
    'Кафе японской кухни Bushido в Сочи: роллы, суши, пицца и напитки с доставкой и самовывозом. Всегда свежие ингредиенты и насыщенный вкус.',
  metadataBase: new URL('https://bushido.example.com'), // ← обязательно укажи свой домен
  openGraph: {
    title: 'Bushido — суши и роллы с доставкой в Сочи',
    description: 'Японская кухня Bushido: свежие роллы, суши, пицца и напитки с доставкой или самовывозом.',
    url: '/',
    siteName: 'Bushido',
    locale: 'ru_RU',
    type: 'website',
    images: [
      {
        url: '/og-main.jpg',
        width: 1200,
        height: 630,
        alt: 'Bushido — японская кухня',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bushido — японская кухня в Сочи',
    description: 'Роллы, суши, пицца и напитки с доставкой. Закажите свежую японскую еду в Bushido.',
    images: ['/og-main.jpg'],
  },

  robots: 'index, follow',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): JSX.Element {
  return (
    <html lang="ru">
      <body className={`${inter.variable} ${roboto.variable}`}>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
