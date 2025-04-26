import { DivProps } from '@/types/html/html';

/**
 * Props for the `CountButton` component.
 *
 * Inherits all standard `<div>` HTML attributes via `DivProps`,
 * and adds additional control-specific properties.
 *
 * ---
 *
 * Пропсы для компонента `CountButton`.
 *
 * Наследует все стандартные HTML-атрибуты для тега `<div>` через `DivProps`,
 * а также добавляет специфические свойства для управления количеством.
 *
 * @property {number} quantity - Current quantity value / Текущее количество товаров.
 * @property {() => void} onIncrement - Function to increment quantity / Функция увеличения количества.
 * @property {() => void} onDecrement - Function to decrement quantity / Функция уменьшения количества.
 */
export type CountButtonProps = DivProps & {
  quantity: number;
  onIncrement: () => void;
  onDecrement: () => void;
};
