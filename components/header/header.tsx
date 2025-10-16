import { JSX } from 'react';
import styles from './header.module.scss';
import { Logo } from '@/components/header/logo/logo';
import { Button } from '@/components/ui/button/button';
import { MenuButton } from '@/components/header/menu-button/menu-button';
import { SearchButton } from '@/components/header/search-button/search-button';
import { ActionButton } from './action-button/action-button';

/**
 * Header component.
 *
 * Displays the top navigation bar with logo, login button, and search button.
 * Combines layout and interaction elements.
 *
 * ---
 * Компонент шапки сайта.
 * Отображает верхнюю панель с логотипом, кнопкой входа и кнопкой поиска.
 * Объединяет элементы интерфейса и навигации.
 */
export const Header = (): JSX.Element => {
  return (
    <header className={styles.header}>
      <MenuButton />

      <div className={styles.content}>
        <Logo className={styles.logo} />

        <div className={styles.actions}>
          <Button label="Войти" type="login" />
          <ActionButton action={'cart'} className={styles.cart} />
          <SearchButton />
        </div>
      </div>
    </header>
  );
};
