import clsx from 'clsx';
import { JSX } from 'react';
import CartIcon from 'src/old/assets/control-panel/cart.svg';
import SearchIcon from 'src/old/assets/control-panel/search.svg';
import FavoritesIcon from 'src/old/assets/control-panel/favorites.svg';
import styles from 'src/old/components/header/search-button/search-button.module.scss';
import { ActionButtonProps, ActionIcons } from 'src/old/components/header/action-button/action-button.props';

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
