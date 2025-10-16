import { JSX } from 'react';
import clsx from 'clsx';
import styles from './count-button.module.scss';
import { MinusIcon, PlusIcon } from '@/assets/counter-button';
import { CountButtonProps } from '@/components/ui/count-button/count-button.props';

/**
 * CountButton UI component.
 *
 * Renders a quantity counter with increment and decrement buttons,
 * using `PlusIcon` and `MinusIcon` icons.
 * Adjusts visual style when quantity is greater than 1.
 *
 * Used in product cards on the homepage, in the shopping cart, and on the product detail page.
 *
 * ---
 *
 * Компонент UI для отображения кнопки счётчика количества товаров.
 *
 * Отображает кнопки увеличения и уменьшения количества с иконками `PlusIcon` и `MinusIcon`.
 * Меняет визуальный стиль при количестве больше одного.
 *
 * Используется в карточке товара на главной странице, в корзине и на странице товара.
 *
 * @param {CountButtonProps} props Object of component props / Объект пропсов компонента.
 * @param {number} props.quantity Current quantity value / Текущее количество товаров.
 * @param {() => void} props.onIncrement Function to increment quantity / Функция увеличения количества.
 * @param {() => void} props.onDecrement Function to decrement quantity / Функция уменьшения количества.
 * @param {string} [props.className] Additional CSS classes / Дополнительные CSS-классы.
 *
 * @returns {JSX.Element} => Rendered counter button component / JSX-элемент кнопки счётчика
 *
 * @example
 * <CountButton
 *   quantity={2}
 *   onIncrement={() => setQuantity(q => q + 1)}
 *   onDecrement={() => setQuantity(q => Math.max(q - 1, 1))}
 * />
 */
export const CountButton = ({
  quantity,
  onIncrement,
  onDecrement,
  className,
  ...props
}: CountButtonProps): JSX.Element => {
  return (
    <div className={clsx(styles.button, className, quantity > 1 && styles.quantityMulti)} {...props}>
      <span className={clsx(styles.icon)} onClick={onDecrement}>
        <MinusIcon />
      </span>
      <span className={clsx(styles.quantity)}>{quantity}</span>
      <span className={clsx(styles.icon)} onClick={onIncrement}>
        <PlusIcon />
      </span>
    </div>
  );
};
