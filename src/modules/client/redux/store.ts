import { configureStore } from '@reduxjs/toolkit';

import cartReducer from 'modules/client/cart/model/cart-slice';
import menuReduce from 'modules/client/redux/slices/menu-slice';
import checkoutReducer from 'modules/client/redux/slices/checkout-slice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    checkout: checkoutReducer,
    menu: menuReduce,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
