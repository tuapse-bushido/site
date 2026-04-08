'use client';

import clsx from 'clsx';
import { JSX } from 'react';
import styles from './nav-item.module.scss';
import { usePathname } from 'next/navigation';
import { NavItemProps } from './nav-item.props';
import { LinkButton } from 'modules/client/shared/ui/link-button';

export const NavItem = ({ href, label, children }: NavItemProps): JSX.Element => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <LinkButton
      className={clsx(styles.item, isActive && styles.active)}
      href={href}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
      <span className={styles.label}>{label}</span>
    </LinkButton>
  );
};
