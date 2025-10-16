import { JSX } from 'react';
import { FieldsetProps } from '@/components/ui/fieldset/fieldset.props';
import styles from './fieldset.module.scss';
import clsx from 'clsx';

export const Fieldset = ({ children, legendTitle, className, ...props }: FieldsetProps): JSX.Element => {
  return (
    <fieldset className={clsx(styles.fieldset, className)} {...props}>
      <legend className={styles.legend}>{legendTitle}</legend>
      {children}
    </fieldset>
  );
};
