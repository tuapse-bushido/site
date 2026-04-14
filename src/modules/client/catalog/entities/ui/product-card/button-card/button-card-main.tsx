'use client';

import { JSX } from 'react';
import { useAppDispatch, useAppSelector } from 'modules/client/redux/hooks/hooks';
import { addToCart, decrementQuantity, incrementQuantity } from 'modules/client/cart/model/cart-slice';
import { CountButton } from 'modules/client/shared/ui/count-button/count-button';
import { ButtonCardMainProps } from './button-card-main.props';
import { CartState } from 'modules/client/cart/model/cart-state.types';

export const ButtonCardMain = ({ product }: ButtonCardMainProps): JSX.Element => {
  const cart = useAppSelector((state): CartState => state.cart);
  const dispatch = useAppDispatch();

  const { id } = product;

  const inCart = cart.items[id] ?? cart.addons[id];
  const quantity = cart.items[id]?.quantity_in_cart ?? cart.addons[id]?.quantity_in_cart;

  const handlerAddToCart = (): void => {
    dispatch(
      addToCart({
        ...product,
        quantity_in_cart: 1,
        // Если каких-то полей не хватает в product, их придется явно указать или
        // убедиться, что ButtonCardMainProps включает полный Product
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
        <button className={'btn btnInCart'} type={'button'} onClick={handlerAddToCart}>
          В корзину
        </button>
      )}
    </>
  );
};
