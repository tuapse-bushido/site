import { JSX } from 'react';
import { IconLabelItem } from '@/components/ui/icon-label-item/icon-label-item';
import { MenuItemProps } from '@/components/menu/menu-item/menu-item.props';
import { Hot, New, Onigiri, Pizza, Rolls, Salads, Sets, Sushi, Wok } from '@/assets/menu-page/index';

import styles from './menu-item.module.scss';
import { IconKey, IconMapMenu } from '@/types';

const iconMap: IconMapMenu = {
  new: New,
  hot: Hot,
  onigiri: Onigiri,
  pizza: Pizza,
  rolls: Rolls,
  sushi: Sushi,
  salads: Salads,
  sets: Sets,
  wok: Wok,
};

export const MenuItem = ({ item }: MenuItemProps): JSX.Element => {
  return (
    <IconLabelItem
      icon={iconMap[item.icon as IconKey]}
      label={item.title}
      href={item.href}
      rootClassName={styles.root}
      iconClassName={styles.icon}
    />
  );
};
