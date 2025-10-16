'use client';
import clsx from 'clsx';
import { JSX } from 'react';
import styles from './menu-button.module.scss';
import { toggleSidebar } from '@/libs/redux/slices/menu-slice';
import { useAppDispatch, useAppSelector } from '@/libs/redux/hooks/hooks';

export const MenuButton = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state): boolean => state.menu.isSidebarOpen);

  const handlerOpenMenu = (): void => {
    dispatch(toggleSidebar());
  };

  return (
    <div className={clsx(styles.wrapper, isOpen && styles.rotated)} onClick={handlerOpenMenu}>
      <div className={clsx(styles.flipper, isOpen && styles.rotated)}>
        <div className={styles.front}>
          <div className={styles.icon}>
            <div className={styles.divider}></div>
          </div>
          <span>Меню</span>
        </div>
        <div className={styles.back}>
          <div className={styles.cross}></div>
        </div>
      </div>
    </div>
  );
};
