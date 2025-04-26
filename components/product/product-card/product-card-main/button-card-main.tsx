'use client';

import { JSX, useLayoutEffect, useState } from 'react';
import { Button } from '@/components/ui/button/button';
import { ButtonCardMainProps } from '@/components/product/product-card/product-card-main/button-card-main.props';
import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks/hooks';
import { CartState } from '@/types';
import { addToCart, decrementQuantity, incrementQuantity } from '@/libs/redux/slices/cart-slice';
import { CountButton } from '@/components/ui/count-button/count-button';

export const ButtonCardMain = ({ product }: ButtonCardMainProps): JSX.Element => {
  const dispatch = useAppDispatch();

  const cart = useAppSelector((state): CartState => state.cart);
  const [inCart, setInCart] = useState<boolean>(false);

  const [quantity, setQuantity] = useState<number>(0);

  const handlerAddToCart = (): void => {
    dispatch(
      addToCart({
        quantity: quantity + 1,
        ...product,
      }),
    );
    setQuantity((prev): number => prev + 1);
    setInCart(true);
  };

  const handlerDecrementQuantity = (): void => {
    dispatch(decrementQuantity({ id: product.id }));

    if (quantity === 1) setInCart(false);
    setQuantity((prev): number => prev - 1);
  };
  const handlerIncrementQuantity = (): void => {
    dispatch(incrementQuantity({ id: product.id }));
    setQuantity((prev): number => prev + 1);
  };

  useLayoutEffect((): void => {
    if (cart[product.id]) setInCart(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
