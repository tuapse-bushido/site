import React from 'react';
import { Category } from '@/types/db/tables/category';
import { ProductCard } from '@/types/db/composite/product-card';

/**
 * Union type of all available bottom navigation icon IDs.
 *
 * Used to map icons in `IconMap` and reference them in navigation items.
 *
 * ---
 * Перечисление идентификаторов иконок нижней навигации.
 * Используется для связи с отображаемыми SVG-иконками и в структуре `BottomNavItem`.
 */
export type IconId = 'home' | 'menu' | 'promo' | 'cart' | 'profile';

/**
 * Maps each `iconId` to its corresponding React SVG component.
 *
 * ---
 * Сопоставление идентификаторов иконок с React-компонентами SVG.
 */
export type IconMap = Record<IconId, React.FC<React.SVGProps<SVGSVGElement>>>;

/**
 * Describes a single item in the bottom navigation bar.
 *
 * - `iconId`: icon key to retrieve from the icon map
 * - `label`: visible label under the icon
 * - `href`: route to navigate when clicked
 *
 * ---
 * Элемент нижней панели навигации:
 * - `iconId` — ключ для поиска соответствующей SVG-иконки
 * - `label` — текстовая подпись под иконкой
 * - `href` — путь маршрута
 */
export type BottomNavItem = {
  iconId: IconId;
  label: string;
  href: string;
};

export type MenuPageItem = {
  title: string;
  icon: string;
  href: string;
};

export type GroupedItem = {
  category: Category;
  products: ProductCard[];
};

export type Grouped = GroupedItem[];
