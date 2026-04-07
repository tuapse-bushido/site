import clsx from 'clsx';
import { JSX } from 'react';
import styles from './input-group.module.scss';
import { InputGroupProps } from './input-group.props';

export const InputGroup = ({ id, labelTitle, classNames, ...inputProps }: InputGroupProps): JSX.Element => {
  return (
    <div className={clsx(styles.root, classNames?.root)}>
      {labelTitle && (
        <label htmlFor={id} className={clsx(styles.label, classNames?.label)}>
          {labelTitle}
        </label>
      )}
      <input id={id} className={styles.input} {...inputProps} />
    </div>
  );
};
