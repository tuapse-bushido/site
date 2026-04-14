import clsx from 'clsx';
import { JSX } from 'react';
import styles from './fieldset.module.scss';
import { FieldsetProps } from './fieldset.props';

export const Fieldset = ({ children, legendTitle, className, ...props }: FieldsetProps): JSX.Element => {
  return (
    <fieldset className={clsx(styles.fieldset, className)} {...props}>
      <legend className={styles.legend}>{legendTitle}</legend>
      {children}
    </fieldset>
  );
};
