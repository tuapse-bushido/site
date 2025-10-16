import { configureStore } from '@reduxjs/toolkit';

import cartReducer from '@/libs/redux/slices/cart-slice';
import menuReduce from '@/libs/redux/slices/menu-slice';
import checkoutReducer from '@/libs/redux/slices/checkout-slice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer,
    menu: menuReduce,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
