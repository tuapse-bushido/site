import { JSX } from 'react';
import { menuPage } from '@/utils/navigation';
import { MenuPageItem } from '@/types';
import { MenuItem } from '@/components/menu/menu-item/menu-item';
import styles from './menu-list.module.scss';

export const MenuList = async (): Promise<JSX.Element> => {
  const getData = (): Promise<MenuPageItem[]> => {
    return new Promise((resolve): void => {
      setTimeout((): void => {
        resolve(menuPage);
      }, 1000);
    });
  };

  const menuItems: MenuPageItem[] = await getData();

  return (
    <div className={styles.menuList}>
      {menuItems.map(
        (item, i): JSX.Element => (
          <MenuItem key={i} item={item} />
        ),
      )}
    </div>
  );
};
