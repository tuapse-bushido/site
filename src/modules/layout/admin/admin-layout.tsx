'use client';

import { AdminSidebar } from './sidebar-menu';
import styles from './admin-layout.module.scss';
import { JSX, ReactNode, useState } from 'react';
import { Header } from 'modules/layout/admin/header/header';

export const AdminLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  const [open, setOpen] = useState(false);
  const toggleDrawer = (): void => setOpen((prev): boolean => !prev);

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <Header onClickAction={toggleDrawer} />
      </header>

      <AdminSidebar variant="temporary" open={open} onClose={toggleDrawer} />
      <AdminSidebar variant="permanent" />

      <main className={styles.main}>{children}</main>
    </div>
  );
};
