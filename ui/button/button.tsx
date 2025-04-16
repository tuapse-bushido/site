import { JSX } from 'react';
import clsx from 'clsx';
import { ButtonComponentProps } from '@/ui/button/button.props';
import styles from './button.module.scss';

/**
 * Button component.
 *
 * Renders a button with dynamic label and visual style based on the `type` prop.
 * Disables interaction for `waiting` or `inActive` types.
 *
 * ---
 * Компонент кнопки.
 * Отображает кнопку с текстом и стилем в зависимости от типа (`type`).
 * Блокирует взаимодействие при типах `waiting` или `inActive`.
 */
export const Button = ({ label, type, className, ...props }: ButtonComponentProps): JSX.Element => {
  const isDisabled = type === 'waiting' || type === 'inActive';

  return (
    <button
      className={clsx(styles.button, className, styles[type])}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      {...props}
    >
      {label}
    </button>
  );
};
