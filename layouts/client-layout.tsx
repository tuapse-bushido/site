'use client';

import React, { JSX } from 'react';
import { Header } from '@/components/header/header';
import { Carousel } from '@/components/carousel/carousel';
import { BottomNav } from '@/components/bottom-nav/bottom-nav';
import { ClientLayoutProps } from '@/layouts/clients-layouts.props';
import styles from './client-layout.module.scss';
import { usePathname } from 'next/navigation';
import { TopNav } from '@/components/top-nav/top-nav';

export const ClientLayout = ({ children }: ClientLayoutProps): JSX.Element => {
  const pathname = usePathname();
  const isHome = pathname === '/';
  return (
    <div className={styles.container}>
      <Header />
      {isHome && (
        <>
          <Carousel />
          <TopNav />
        </>
      )}
      <main className={styles.main}>{children}</main>

      <BottomNav className={styles.bottomNav} />
    </div>
  );
};
