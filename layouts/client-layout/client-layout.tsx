import React, { JSX } from 'react';
import styles from './client-layout.module.scss';
import { Header } from '@/components/header/header';
import { TopNav } from '@/components/top-nav/top-nav';
import { Carousel } from '@/components/carousel/carousel';
import { BottomNav } from '@/components/bottom-nav/bottom-nav';
import { ClientLayoutProps } from '@/layouts/client-layout/clients-layouts.props';
import { ReduxProvider } from '@/components/providers/redux-provider/redux-provider';
import { SidebarNav } from '@/components/sidebar-nav/sidebar-nav';

export const ClientLayout = ({ children }: ClientLayoutProps): JSX.Element => {
  return (
    <ReduxProvider>
      <div className={styles.layout}>
        <Header />

        <div className={styles.contentGrid}>
          <SidebarNav />

          <div className={styles.content}>
            <Carousel />
            <TopNav />

            <main className={styles.main}>{children}</main>
          </div>
        </div>

        <BottomNav className={styles.bottomNav} />
      </div>
    </ReduxProvider>
  );
};
