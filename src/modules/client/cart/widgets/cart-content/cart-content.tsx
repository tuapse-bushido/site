'use client';

import { JSX } from 'react';
import { useAppSelector } from 'modules/client/redux';
import { CartEmptyState } from 'modules/client/cart/ui';
import { CartScreen } from 'modules/client/cart/screens/cart-screen';
import { CartItems } from 'modules/client/cart/model/cart-state.types';

export const CartContent = (): JSX.Element => {
  const items = useAppSelector((state): CartItems => state.cart.items);
  const hasItems = Object.keys(items).length > 0;

  return hasItems ? <CartScreen /> : <CartEmptyState />;
};
