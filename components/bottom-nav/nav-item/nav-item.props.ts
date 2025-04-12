import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { BottomNavItem } from '@/types';

type DivProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;

/**
 * Props for a single bottom navigation item component.
 *
 * - `navItem`: configuration object with icon, label, and route
 * - Inherits standard `<div>` props
 *
 * ---
 * Пропсы для компонента элемента нижней навигации.
 *
 * - `navItem` — объект с иконкой, подписью и маршрутом
 * - Наследует стандартные пропсы `<div>`
 */
export type NavItemProps = DivProps & {
  navItem: BottomNavItem;
};
