import { JSX } from 'react';
import styles from './top-nav.module.scss';
import { NavItem } from '@/components/top-nav/nav-item/nav-item';

/**
 * TopNav component.
 *
 * Renders a horizontal navigation menu with category buttons.
 * Uses a static list of category labels (currently hardcoded, e.g. from DB).
 *
 * ---
 * Компонент верхнего меню (`TopNav`).
 *
 * Отображает горизонтальное меню с кнопками категорий.
 * Использует статичный список названий (временно, как из базы данных).
 */
export const TopNav = (): JSX.Element => {
  const dbTopNav = ['Выгодно', 'Сеты', 'Роллы', 'Закуски', 'Горячие роллы', 'Запеченные роллы'];

  return (
    <nav className={styles.nav}>
      {dbTopNav.map(
        (item, i): JSX.Element => (
          <NavItem key={i} label={item} type={'topNav'} />
        ),
      )}
    </nav>
  );
};
