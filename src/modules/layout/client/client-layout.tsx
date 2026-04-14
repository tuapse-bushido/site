import { Header } from './header';
import { JSX, ReactNode, Suspense } from 'react';
import { BottomNav } from './navigation';
import styles from './client-layout.module.scss';
import { ReduxProvider } from 'modules/providers/redux';

export const ClientLayout = ({ children }: { children: ReactNode }): JSX.Element => {
  return (
    <ReduxProvider>
      <div className={styles.layout}>
        <Header />

        <div className={styles.contentGrid}>
          {/*<SidebarNav />*/}

          <div className={styles.content}>
            {/*<Carousel />*/}
            {/*<TopNav />*/}

            <main className={styles.main}>{children}</main>
          </div>
        </div>

        <Suspense fallback={null}>
          <BottomNav />
        </Suspense>
      </div>
    </ReduxProvider>
  );
};
