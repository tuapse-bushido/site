'use client';

import { JSX } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import styles from './nav-item.module.scss';
import { IconMap } from '@/types';
import { NavItemProps } from '@/components/bottom-nav/nav-item/nav-item.props';
import clsx from 'clsx';

import { CartIcon, HomeIcon, MenuIcon, ProfileIcon, PromoIcon } from '@/assets/icons-bottom-nav/index';

const iconMap: IconMap = {
  home: HomeIcon,
  menu: MenuIcon,
  promo: PromoIcon,
  cart: CartIcon,
  profile: ProfileIcon,
};

/**
 * Individual navigation item for the bottom navigation bar.
 *
 * Renders a link with an icon and a label. Highlights the active route
 * based on the current pathname using `usePathname` from Next.js app router.
 *
 * Uses `iconId` from `navItem` to retrieve the correct SVG icon from `iconMap`.
 *
 * ---
 * Компонент пункта нижней навигации.
 * Отображает ссылку с иконкой и подписью. Определяет активный пункт через `usePathname`,
 * сравнивая текущий путь с `navItem.href`.
 *
 * Иконка выбирается по `iconId` из локальной карты `iconMap`.
 */
export const NavItem = ({ navItem }: NavItemProps): JSX.Element => {
  const pathname = usePathname();
  const isActive = pathname === navItem.href;

  const Icon = iconMap[navItem.iconId];

  return (
    <Link
      className={clsx(styles.navItemLink, isActive && styles.active)}
      href={navItem.href}
      aria-label={navItem.label}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon aria-hidden="true" focusable="false" />
      <span className={clsx(styles.navItemLabel)}>{navItem.label}</span>
    </Link>
  );
};
