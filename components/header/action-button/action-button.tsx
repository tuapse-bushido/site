import clsx from 'clsx';
import { JSX } from 'react';
import CartIcon from '@/assets/control-panel/cart.svg';
import SearchIcon from '@/assets/control-panel/search.svg';
import FavoritesIcon from '@/assets/control-panel/favorites.svg';
import styles from '@/components/header/search-button/search-button.module.scss';
import { ActionButtonProps, ActionIcons } from '@/components/header/action-button/action-button.props';

const actionIcons: ActionIcons = {
  cart: CartIcon,
  search: SearchIcon,
  favorites: FavoritesIcon,
};

export const ActionButton = ({ action }: ActionButtonProps): JSX.Element => {
  const Icon = actionIcons[action];

  return (
    <button className={clsx(styles.button, styles[action])}>
      <Icon />
    </button>
  );
};
