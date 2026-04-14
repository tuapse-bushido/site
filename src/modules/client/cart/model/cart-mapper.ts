import { AddonProduct } from 'modules/client/entities';
import { AddonEntry, CartCardViewModel, CartItem } from './cart-state.types';

export const mapAddonToCartItem = (addon: AddonProduct, quantity: number): CartItem => {
  return {
    ...addon,
    quantity_in_cart: quantity,

    is_active: true,
    is_visible: true,
    is_set: false,

    ingredients: [],
    category_ids: [],
    addons: [],
    set_items: [],
  };
};

export const mapCartProductToView = (item: CartItem): CartCardViewModel => {
  const { count_portion, discount_percent: percent, price } = item;

  const view: CartCardViewModel = {
    id: item.id,
    title: item.title,
    imageLink: item.image_link,
    weight: item.weight,
    price,
    isFree: false,
    quantityInCart: item.quantity_in_cart,
  };

  if (count_portion > 1) {
    view.countPortion = count_portion;
  }

  if (percent > 0) {
    view.discountPrice = price - (price * percent) / 100;
    view.discountPercent = percent;
  }

  return view;
};

export const mapCartAddonToView = (addon: AddonEntry): CartCardViewModel => {
  const isFree = addon.quantity_in_cart <= addon.max_free_quantity;

  return {
    id: addon.addon_product.id,
    title: addon.addon_product.title,
    imageLink: addon.addon_product.image_link,
    weight: addon.addon_product.weight,
    countPortion: addon.addon_product.count_portion,
    price: addon.addon_product.price,
    isFree: isFree,
    quantityInCart: addon.quantity_in_cart,
  };
};
