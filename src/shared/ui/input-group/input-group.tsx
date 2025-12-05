import clsx from 'clsx';
import { JSX } from 'react';
import styles from './input-group.module.scss';
import { InputGroupProps } from './input-group.props';

export const InputGroup = ({
  id,
  labelTitle,
  variant = 'front',
  classNames,
  rootProps,
  labelProps,
  ...inputProps
}: InputGroupProps): JSX.Element => {
  return (
    <div className={clsx(styles.wrapper, variant === 'back' && styles.admin, classNames?.rootClassName)} {...rootProps}>
      {labelTitle && (
        <label htmlFor={id} className={clsx(styles.label, classNames?.labelClassName)} {...labelProps}>
          {labelTitle}
        </label>
      )}
      <input id={id} className={clsx(styles.input, classNames?.inputClassName)} {...inputProps} />
    </div>
  );
};
