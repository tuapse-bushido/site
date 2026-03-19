'use client';

import Link from 'next/link';
import { MenuItem } from '@/utils/menu/menu.config';
import { JSX, memo, MouseEventHandler } from 'react';
import clsx from 'clsx';
import styles from './menu-item.module.scss';

export type SidebarMenuItemProps = {
  item: MenuItem;
  onClick?: MouseEventHandler<HTMLAnchorElement> | undefined;
  isActive?: boolean;
};

export const SidebarMenuItem = memo(({ item, onClick, isActive }: SidebarMenuItemProps): JSX.Element => {
  const linkProps = item.children && onClick ? { onClick: onClick } : {};

  return (
    <li>
      <Link href={item.link} {...linkProps}>
        {item.label}
      </Link>

      {item.children && (
        <ul className={clsx(styles.subMenu, isActive && styles.active)}>
          {item.children.map(
            (child): JSX.Element => (
              <SidebarMenuItem key={child.id} item={child} />
            ),
          )}
        </ul>
      )}
    </li>
  );
});

SidebarMenuItem.displayName = 'SidebarMenuItem';
