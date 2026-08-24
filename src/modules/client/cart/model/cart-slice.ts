import { CartItem, CartState } from './cart-state.types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { pruneAddonsForParent, upsertAddonForProduct } from './cart-mutations';

const initialState: CartState = {
  items: {},
  addons: {},
};

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    /**
     * Добавляет товар в корзину или обновляет его количество, если он уже есть.
     *
     * - Если это добавка — обновляет `quantity_in_cart` и помечает как изменённую пользователем.
     * - Иначе добавляет товар в `items` и вызывает `upsertAddonForProduct` для обработки добавок.
     *
     * @param state Состояние корзины
     * @param action Payload с товаром (CartItem)
     *
     * @example
     * dispatch(addToCart({
     *   id: 101,
     *   title: 'Сет роллов',
     *   quantity_in_cart: 1,
     *   addons: [...],
     *   ...
     * }));
     */
    addToCart: (state, action: PayloadAction<CartItem>): void => {
      const product = action.payload;
      const { id, quantity_in_cart } = product;

      if (state.addons[id]) {
        state.addons[id].quantity_in_cart = quantity_in_cart;
        state.addons[id].is_user_modified = true;
      } else {
        state.items[id] = product;
        upsertAddonForProduct(state, product, quantity_in_cart);
      }
    },
    /**
     * Увеличивает количество товара или добавки в корзине на 1.
     *
     * - Если это добавка — увеличивает и помечает как изменённую пользователем.
     * - Иначе увеличивает количество основного товара и вызывает `upsertAddonForProduct`.
     *
     * @param state Состояние корзины
     * @param action Payload с `id` товара
     *
     * @example
     * dispatch(incrementQuantity({ id: 101 }));
     */
    incrementQuantity: (state: CartState, action: PayloadAction<{ id: number }>): void => {
      const { id } = action.payload;

      if (state.addons[id]) {
        state.addons[id].quantity_in_cart += 1;
        state.addons[id].is_user_modified = true;
      } else {
        const product = state.items[id];
        state.items[id].quantity_in_cart += 1;
        upsertAddonForProduct(state, product, 1);
      }
    },
    /**
     * Уменьшает количество товара или добавки в корзине на 1 с учётом удаления.
     *
     * - Если это добавка:
     *   - Уменьшает `quantity_in_cart`
     *   - Удаляет, если достигнуто 0
     * - Если это основной товар:
     *   - Вызывает `pruneAddonsForParent` для очистки связанных добавок
     *   - Уменьшает или удаляет товар
     *
     * @param state Состояние корзины
     * @param action Payload с `id` товара
     *
     * @example
     * dispatch(decrementQuantity({ id: 101 }));
     */
    decrementQuantity: (state, action: PayloadAction<{ id: number }>): void => {
      const { id } = action.payload;

      if (state.addons[id]) {
        const addon = state.addons[id];
        if (addon.quantity_in_cart > 1) {
          addon.quantity_in_cart -= 1;
        } else {
          delete state.addons[id];
        }

        addon.is_user_modified = true;
      } else if (state.items[id]) {
        const item = state.items[id];

        pruneAddonsForParent(state, item.id, 1);

        if (item.quantity_in_cart > 1) {
          item.quantity_in_cart -= 1;
        } else {
          delete state.items[id];
        }
      }
    },
    clearCartState: (state: CartState): void => {
      state.items = {};
      state.addons = {};
    },
  },
});

export const { addToCart, incrementQuantity, decrementQuantity, clearCartState } = cartSlice.actions;

export default cartSlice.reducer;
