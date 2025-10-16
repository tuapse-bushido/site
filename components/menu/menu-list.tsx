import { JSX } from 'react';
import styles from './menu-list.module.scss';
import { getAllActiveCategories } from '@/libs/db/category/category.query';
import { IconLabelItem } from '../ui/icon-label-item/icon-label-item';

export const MenuList = async (): Promise<JSX.Element | null> => {
  const categories = await getAllActiveCategories();

  if (!categories.success) return null;

  return (
    <ul className={styles.sidebar}>
      {categories.data.map(
        (item): JSX.Element => (
          <li key={item.id}>
            <IconLabelItem href={item.slug} label={item.title} icon={item.image_link ?? 'no_image.png'} />
          </li>
        ),
      )}
    </ul>
  );
};
