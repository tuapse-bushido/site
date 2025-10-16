import { JSX } from 'react';
import styles from './search-button.module.scss';
import SearchIcon from '@/assets/control-panel/search.svg';

/**
 * Search button component.
 *
 * Renders a minimal icon button for initiating search actions.
 *
 * ---
 * Компонент кнопки поиска.
 * Отображает компактную иконку-кнопку для запуска поиска.
 */
export const SearchButton = (): JSX.Element => {
  return (
    <button className={styles.button}>
      <SearchIcon />
    </button>
  );
};
