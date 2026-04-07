import { JSX } from 'react';
import styles from './label.module.scss';

export const Label = ({ label, required }: { label: string; required?: boolean }): JSX.Element => {
  return (
    <>
      {label}
      {required && <span className={styles.required}>*</span>}
    </>
  );
};
