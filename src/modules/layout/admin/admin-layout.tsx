import { JSX, ReactNode } from 'react';
import Drawer from '@mui/material/Drawer';
import styles from './admin-layout.module.scss';
import { AdminSidebarMenu } from './sidebar-menu';

export const AdminLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <div className={styles.layout}>
      <header className={styles.header}></header>

      <Drawer
        component="aside"
        className={styles.sidebar}
        variant="permanent"
        open
        slotProps={{
          paper: {
            sx: {
              position: 'static',
              width: '100%',
              height: '100%',
              border: 'none',
            },
          },
        }}
        sx={{
          height: '100%',
          '& .MuiDrawer-paper': { boxSizing: 'border-box' },
        }}
      >
        <AdminSidebarMenu />
      </Drawer>

      <main className={styles.main}>{children}</main>
    </div>
  );
};
