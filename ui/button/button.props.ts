import { DetailedHTMLProps, HTMLAttributes } from 'react';

type ButtonProps = DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

/**
 * Props for the `Button` component.
 *
 * - `label`: Button text.
 * - `type?`: Optional visual and behavioral modifier:
 *   - `'inCart'`: Button to add to cart from the main menu.
 *   - `'inActive'`: Fully disabled state.
 *   - `'waiting'`: Temporarily disabled (e.g. waiting for SMS resend).
 *   - `'cancel'`: Secondary/cancel action.
 *   - `'login'`: Login button style.
 *   - *(if omitted)*: Treated as a primary button.
 *
 * ---
 * Пропсы для компонента `Button`.
 *
 * - `label`: Текст кнопки.
 * - `type?`: Необязательный модификатор внешнего вида и поведения:
 *   - `'inCart'`: Кнопка «в корзину» из главного меню.
 *   - `'inActive'`: Полностью неактивное состояние.
 *   - `'waiting'`: Временно неактивна (например, ожидание повтора отправки СМС).
 *   - `'cancel'`: Альтернативное действие / отмена.
 *   - `'login'`: Стиль кнопки входа.
 *   - *(если не указано)*: Кнопка в стиле primary.
 */
export type ButtonComponentProps = ButtonProps & {
  label: string;
  type?: 'inCart' | 'inActive' | 'waiting' | 'cancel' | 'login';
};
