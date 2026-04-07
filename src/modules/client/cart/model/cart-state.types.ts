import { AddonProduct, ProductCard } from 'modules/client/entities';

/**
 * Тип позиции в корзине, основанный на `ProductCard` с количеством.
 */
export type CartItem = ProductCard & {
  quantity_in_cart: number;
};

/**
 * Хэш-таблица товаров в корзине по ID продукта.
 */
export type CartItems = Record<number, CartItem>;

/**
 * Представление применённого правила добавок.
 */
export type AddonRuleEntry = {
  addon_rule_id: number;
  base_count: number;
  divisor: number;
  show_count_percent: number;
  quantity_parent: number;
  max_free_for_rule: number;
  show_count_for_rule: number;
};

/**
 * Запись о добавке в корзине с применёнными правилами и количеством.
 */
export type AddonEntry = {
  addon_product: AddonProduct;
  addon_rules: Record<number, AddonRuleEntry>;
  quantity_in_cart: number;
  max_free_quantity: number;
  is_user_modified: boolean;
};

/**
 * Хэш-таблица всех добавок в корзине, где ключ — ID продукта-добавки.
 */
export type Addons = Record<number, AddonEntry>;

/**
 * Структура состояния корзины в Redux.
 */
export type CartState = {
  items: CartItems;
  addons: Addons;
};

export type CartCardViewModel = {
  id: number;
  title: string;
  imageLink: string;
  weight: number;
  countPortion?: number;

  discountPercent?: number;

  price: number;
  discountPrice?: number;

  isFree: boolean;

  quantityInCart: number;
};
