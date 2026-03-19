import { JSX } from 'react';
import { AdminLayoutProps } from '@/layouts/admin-layout/admin-layout.props';
import { AdminSidebarMenu } from '@/components/admin/sidebar-menu/sidebar-menu';
import styles from './admin-layout.module.scss';

export const AdminLayout = ({ children }: AdminLayoutProps): JSX.Element => {
  return (
    <div className={styles.layout}>
      <AdminSidebarMenu />
      <main className={styles.main}>{children}</main>
    </div>
  );
};
