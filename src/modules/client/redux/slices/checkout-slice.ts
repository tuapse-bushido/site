import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type CheckoutUser = {
  name: string;
  phone: string;
  address?: {
    city: string;
    street: string;
    house: string;
    apartment: string;
    floor: string;
    entrance: string;
    intercom: string;
  };
};

export type CheckoutOrder = {
  order_type: 'delivery' | 'pickup';
  payment_type: 'courier' | 'pickup';
};

export type CheckoutState = {
  order: CheckoutOrder;
  user: CheckoutUser;
};

const initialState: CheckoutState = {
  order: {
    order_type: 'delivery',
    payment_type: 'courier',
  },
  user: {
    name: '',
    phone: '',
  },
};

export const checkoutSlice = createSlice({
  name: 'checkout',
  initialState,
  reducers: {
    addCheckoutInfo: (state, action: PayloadAction<CheckoutState>): void => {
      state.order = action.payload.order;
      state.user = action.payload.user;
    },
    clearCheckoutState: (state: CheckoutState): void => {
      state.order = {
        order_type: 'delivery',
        payment_type: 'courier',
      };
      state.user = {
        name: '',
        phone: '',
      };
    },
  },
});

export const { addCheckoutInfo, clearCheckoutState } = checkoutSlice.actions;

export default checkoutSlice.reducer;
