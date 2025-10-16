import { JSX } from 'react';
import { Divider } from '@/components/cart/divider/divider';
import styles from './admin-page-header.module.scss';

export const AdminPageHeader = ({ title }: { title: string }): JSX.Element => {
  return (
    <div className={styles.wrapper}>
      <h1 className={styles.h1}>{title}</h1>
      <Divider direction={'horizontal'} />
    </div>
  );
};
