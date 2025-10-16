'use client';

import { useAppSelector } from '@/libs/redux/hooks/hooks';
import { CartList } from './cart-list/cart-list';
import { EmptyCart } from '@/components/cart/empty-cart/empty-cart';
import { JSX } from 'react';
import { CartItems } from '@/types';

export const CartPageClientWrapper = (): JSX.Element => {
  const items = useAppSelector((state): CartItems => state.cart.items);
  const hasItems = Object.keys(items).length > 0;

  return hasItems ? <CartList /> : <EmptyCart />;
};
