'use client';

import React, { JSX, useCallback, useMemo, useState } from 'react';
import styles from './sidebar-menu.module.scss';
import { menu } from '@/utils/menu/menu.config';
import { SidebarMenuItem } from '@/components/admin/sidebar-menu/menu-item/menu-item';

export const AdminSidebarMenu = (): JSX.Element => {
  const [isOpen, setIsOpen] = useState<number | null>(null);

  const handlerOpenMenu = useCallback((key: number): void => {
    setIsOpen((prev): number | null => (prev === key ? null : key));
  }, []);

  const clickHandlers = useMemo((): Map<number, React.MouseEventHandler<HTMLAnchorElement>> => {
    const handlers = new Map();
    for (const item of menu) {
      handlers.set(item.id, (): void => {
        handlerOpenMenu(item.id);
      });
    }
    return handlers;
  }, [handlerOpenMenu]);

  const renderedMenu = useMemo((): JSX.Element[] => {
    return menu.map((item): JSX.Element => {
      return (
        <SidebarMenuItem
          key={item.id}
          item={item}
          {...(item.children ? { onClick: clickHandlers.get(item.id) } : {})}
          isActive={item.id === isOpen}
        />
      );
    });
  }, [isOpen, clickHandlers]);

  return (
    <nav className={styles.sidebar}>
      <ul>{renderedMenu}</ul>
    </nav>
  );
};
