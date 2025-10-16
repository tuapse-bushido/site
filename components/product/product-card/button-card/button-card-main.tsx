'use client';

import { JSX } from 'react';
import { Button } from '@/components/ui/button/button';
import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks/hooks';
import { CartState } from '@/types';
import { addToCart, decrementQuantity, incrementQuantity } from '@/libs/redux/slices/cart-slice';
import { CountButton } from '@/components/ui/count-button/count-button';
import { ButtonCardMainProps } from '@/components/product/product-card/button-card/button-card-main.props';

export const ButtonCardMain = ({ product }: ButtonCardMainProps): JSX.Element => {
  const cart = useAppSelector((state): CartState => state.cart);
  const dispatch = useAppDispatch();

  const { id } = product;

  const inCart = cart.items[id] ?? cart.addons[id];
  const quantity = cart.items[id]?.quantity_in_cart ?? cart.addons[id]?.quantity_in_cart;

  const handlerAddToCart = (): void => {
    dispatch(
      addToCart({
        quantity_in_cart: 1,
        ...product,
      }),
    );
  };

  const handlerDecrementQuantity = (): void => {
    dispatch(decrementQuantity({ id: product.id }));
  };
  const handlerIncrementQuantity = (): void => {
    dispatch(incrementQuantity({ id: product.id }));
  };

  return (
    <>
      {inCart ? (
        <CountButton
          quantity={quantity}
          onDecrement={handlerDecrementQuantity}
          onIncrement={handlerIncrementQuantity}
        />
      ) : (
        <Button label={'В корзину'} type={'inCart'} onClick={handlerAddToCart} />
      )}
    </>
  );
};
