import { OrderItemPayload } from '../entity/order-item.entity';
import { CartState } from 'modules/client/cart/model/cart-state.types';

export const orderItemsToInsertMapper = (order_id: number, cart: CartState): OrderItemPayload[] => {
  const payload: OrderItemPayload[] = [];

  const { items, addons } = cart;

  Object.values(items).forEach((item): void => {
    payload.push({
      order_id,
      product_id: item.id,
      quantity_total: item.quantity_in_cart,
      quantity_free: 0,
      unit_price: item.price,
      total_price: item.price * item.quantity_in_cart,
    });
  });

  Object.values(addons).forEach((addon): void => {
    const free_quantity = Math.min(addon.quantity_in_cart, addon.max_free_quantity);

    payload.push({
      order_id,
      product_id: addon.addon_product.id,
      quantity_total: addon.quantity_in_cart,
      quantity_free: free_quantity,
      unit_price: addon.addon_product.price,
      total_price:
        addon.quantity_in_cart > addon.max_free_quantity
          ? (addon.quantity_in_cart - addon.max_free_quantity) * addon.addon_product.price
          : 0,
    });
  });

  return payload;
};
