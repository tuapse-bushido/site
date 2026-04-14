import { JSX } from 'react';
import { CheckoutScreens } from 'modules/client/checkout/screens/checkout-screens';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Оформление заказа',
  description: 'Оформление заказа в кафе Бушидо Туапсе',
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
};

export default function CheckoutPage(): JSX.Element {
  return <CheckoutScreens />;
}
