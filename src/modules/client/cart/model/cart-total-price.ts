import { CartState } from './cart-state.types';

/**
 * Подсчитывает общую стоимость всех товаров и платных добавок в корзине.
 *
 * Добавки учитываются только в той части, которая превышает лимит бесплатных.
 *
 * @param {CartState} cart - Current cart state
 * @returns {number} Total price in rubles
 *
 * @example
 * const total = getTotalPriceInCart(cartState);
 */
export const getTotalPriceInCart = (cart: CartState): number => {
  const { items, addons = {} } = cart;

  const itemsTotalPrice = Object.values(items).reduce(
    (acc, cur): number => acc + cur.price * (1 - cur.discount_percent / 100) * cur.quantity_in_cart,
    0,
  );
  const addonsTotalPrice = Object.values(addons).reduce((acc, cur): number => {
    if (cur.max_free_quantity < cur.quantity_in_cart) {
      acc = acc + (cur.quantity_in_cart - cur.max_free_quantity) * cur.addon_product.price;
    }
    return acc;
  }, 0);

  return itemsTotalPrice + addonsTotalPrice;
};
