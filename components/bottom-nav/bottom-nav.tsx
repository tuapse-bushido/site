import { JSX } from 'react';
import styles from './bottom-nav.module.scss';
import { NavItem } from '@/components/bottom-nav/nav-item/nav-item';
import { bottomNav } from '@/utils/navigation';
import { BottomNavProps } from '@/components/bottom-nav/bottom-nav.props';
import clsx from 'clsx';

/**
 * Bottom navigation bar component.
 *
 * Renders a navigation section fixed at the bottom of the screen,
 * intended for use in mobile layout (up to 400px width).
 *
 * Uses the `bottomNav` configuration array to display navigation items.
 * Responsive logic is not yet implemented and may be added later.
 *
 * ---
 * Компонент нижней навигационной панели.
 * Отображает фиксированную навигацию внизу экрана для мобильного разрешения (до 400px).
 * Использует массив `bottomNav` для генерации пунктов меню.
 * Адаптивное поведение пока не реализовано — будет добавлено при необходимости.
 */
export const BottomNav = ({ className }: BottomNavProps): JSX.Element => {
  return (
    <nav className={clsx(styles.bottomNav, className)} aria-label="Основная навигация">
      {bottomNav.map(
        (item): JSX.Element => (
          <NavItem key={item.label} navItem={item} />
        ),
      )}
    </nav>
  );
};
