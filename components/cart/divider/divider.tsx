import { JSX } from 'react';
import styles from './divider.module.scss';

export const Divider = ({ direction }: { direction: 'horizontal' | 'vertical' }): JSX.Element => {
  return <div className={styles[direction]}></div>;
};
