'use client';
import { JSX, ReactNode } from 'react';
import styles from './client-wrapper.module.scss';
import { useAppSelector } from '@/libs/redux/hooks/hooks';
import clsx from 'clsx';

export const ClientSidebarNav = ({ children }: { children: ReactNode }): JSX.Element | null => {
  const isOpen = useAppSelector((state): boolean => state.menu.isSidebarOpen);

  return (
    <aside className={clsx(styles.wrapper, isOpen && styles.isOpen)}>
      <nav>{children}</nav>
    </aside>
  );
};
