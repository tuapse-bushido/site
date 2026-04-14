'use client';

import clsx from 'clsx';
import { JSX, useMemo } from 'react';
import { LinkButton } from 'modules/client/shared/ui';
import { useAppSelector } from 'modules/client/redux';
import { CartList } from 'modules/client/cart/widgets/cart-list';
import { OrderSummary } from 'modules/client/cart/widgets/order-summary';
import { getTotalPriceInCart } from 'modules/client/cart/model/cart-total-price';
import { Addons, CartCardViewModel, CartItem, CartState } from 'modules/client/cart/model/cart-state.types';
import { mapCartAddonToView, mapCartProductToView } from 'modules/client/cart/model/cart-mapper';

export const CartScreen = (): JSX.Element => {
  const cart = useAppSelector((state): CartState => state.cart);

  const items = useMemo(
    (): CartCardViewModel[] => Object.values(cart.items).map((value): CartCardViewModel => mapCartProductToView(value)),
    [cart.items],
  );
  const addons = useMemo(
    (): CartCardViewModel[] => Object.values(cart.addons).map((value): CartCardViewModel => mapCartAddonToView(value)),
    [cart.addons],
  );

  const prod = useMemo((): CartItem[] => Object.values(cart.items), [cart.items]);
  const add = cart.addons;

  const totalPrice = getTotalPriceInCart(cart);

  return (
    <>
      <CartList products={items} addons={addons} prod={prod} add={add} />
      <OrderSummary totalPrice={totalPrice} />
      <LinkButton href="/checkout" className={clsx('btn', 'btnPrimary')}>
        Оформить заказ
      </LinkButton>
    </>
  );
};
