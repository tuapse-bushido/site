import { ProductCard } from '@/types/db/composite/product-card';

/**
 * Cart item type based on a product card with quantity tracking.
 *
 * ---
 * Тип позиции в корзине, основанный на `ProductCard` с количеством.
 */
export type CartItem = ProductCard & {
  quantity_in_cart: number;
};

/**
 * Hash map of cart items by product ID.
 *
 * ---
 * Хэш-таблица товаров в корзине по ID продукта.
 */
export type CartItems = Record<number, CartItem>;

/**
 * Internal representation of a rule applied to a specific addon.
 *
 * ---
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
 * Entry describing an addon product in the cart with rule context and quantity.
 *
 * ---
 * Запись о добавке в корзине с применёнными правилами и количеством.
 */
export type AddonEntry = {
  addon_product: ProductCard;
  addon_rules: Record<number, AddonRuleEntry>;
  quantity_in_cart: number;
  max_free_quantity: number;
  is_user_modified: boolean;
};

/**
 * Hash map of all addon entries in the cart, keyed by addon product ID.
 *
 * ---
 * Хэш-таблица всех добавок в корзине, где ключ — ID продукта-добавки.
 */
export type Addons = Record<number, AddonEntry>;

/**
 * Redux cart state structure.
 *
 * ---
 * Структура состояния корзины в Redux.
 */
export type CartState = {
  items: CartItems;
  addons: Addons;
};
