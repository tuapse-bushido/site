import { JSX } from 'react';
import styles from './error-message.module.scss';

export const ErrorMessage = ({ text }: { text: string }): JSX.Element => {
  return <p className={styles.p}>{text}</p>;
};
