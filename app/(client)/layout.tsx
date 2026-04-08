import { JSX, ReactNode } from 'react';
import { ClientLayout } from 'modules/layout/client';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Бушидо | Доставка роллов, суши и пиццы в Туапсе',
    template: '%s | Кафе Бушидо',
  },
  description:
    'Доставка вкусных роллов, суши и горячей пиццы в Туапсе от кафе Бушидо. Бесплатная доставка еды на дом при заказе от 500₽. Работаем навынос и на доставку. Заказывайте!',
  keywords: [
    'доставка еды Туапсе',
    'заказать роллы Туапсе',
    'суши Бушидо',
    'доставка пиццы Туапсе',
    'еда на дом Туапсе',
    'японская кухня Туапсе',
    'роллы навынос Туапсе',
    'кафе Бушидо Туапсе',
  ],
};

export default function Layout({
  children,
}: Readonly<{
  children: ReactNode;
}>): JSX.Element {
  return <ClientLayout>{children}</ClientLayout>;
}
