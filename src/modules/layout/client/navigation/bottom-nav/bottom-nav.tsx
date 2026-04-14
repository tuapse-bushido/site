import { JSX } from 'react';
import { NavItem } from './nav-item/nav-item';
import styles from './bottom-nav.module.scss';
import { BOTTOM_NAV_CONFIG } from './bottom-nav.config';

export const BottomNav = (): JSX.Element => {
  return (
    <nav className={styles.navigation} aria-label="Основная навигация">
      {BOTTOM_NAV_CONFIG.map((item): JSX.Element => {
        const Icon = item.icon;
        return (
          <NavItem key={item.label} label={item.label} href={item.href}>
            <Icon width={28} height={28} />
          </NavItem>
        );
      })}
    </nav>
  );
};
