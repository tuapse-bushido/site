import { Product } from '@/types';

export type CartItem = Product & {
  quantity: number;
};

export type CartState = Record<number, CartItem>;

export type CartQuantityChange = {
  id: number;
};

export type CartQuantityUpdate = CartQuantityChange & {
  quantity: number;
};
