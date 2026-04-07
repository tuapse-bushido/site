import { CartState } from 'modules/client/cart/model/cart-state.types';
import { CheckoutFormType } from 'modules/client/checkout/features/checkout-form/model';

export type CreateOrderPayload = {
  checkout: CheckoutFormType;
  cart: CartState;
};
