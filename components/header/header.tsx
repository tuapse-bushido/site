import { JSX } from 'react';
import { Button } from '@/components/ui/button/button';
import styles from './header.module.scss';
import { SearchButton } from '@/components/header/search-button/search-button';
import { Logo } from '@/components/header/logo/logo';
import clsx from 'clsx';

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
      <Logo className={clsx(styles.container, styles.logo)} />

      <div className={styles.container}>
        <Button label={'Войти'} type={'login'} />
        <SearchButton />
      </div>
    </header>
  );
};
