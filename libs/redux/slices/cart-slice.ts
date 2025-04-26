import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CartItem, CartQuantityChange, CartState } from '@/types';

const initialState: CartState = {};

export const cartSlice = createSlice({
  name: 'addToCart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>): void => {
      const { id } = action.payload;
      state[id] = action.payload;
    },
    incrementQuantity: (state, action: PayloadAction<CartQuantityChange>): void => {
      const { id } = action.payload;
      state[id].quantity = state[id].quantity + 1;
    },
    decrementQuantity: (state, action: PayloadAction<CartQuantityChange>): void => {
      const { id } = action.payload;
      if (state[id].quantity === 1) {
        delete state[id];
      } else state[id].quantity = state[id].quantity - 1;
    },
  },
});

export const { addToCart, incrementQuantity, decrementQuantity } = cartSlice.actions;

export default cartSlice.reducer;
