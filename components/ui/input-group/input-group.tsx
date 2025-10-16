import { JSX } from 'react';
import { InputGroupProps } from '@/components/ui/input-group/input-group.props';
import styles from './input-group.module.scss';
import clsx from 'clsx';

export const InputGroup = ({
  label,
  labelProps,
  id,
  wrapperClassName,
  inputClassName,
  labelClassName,
  ...inputProps
}: InputGroupProps): JSX.Element => {
  return (
    <div className={clsx(styles.wrapper, wrapperClassName)}>
      {label && (
        <label htmlFor={id} className={clsx(styles.label, labelClassName)} {...labelProps}>
          {label}
        </label>
      )}
      <input id={id} className={clsx(styles.input, inputClassName)} {...inputProps} />
    </div>
  );
};
