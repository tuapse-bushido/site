import { DetailedHTMLProps, HTMLAttributes } from 'react';

type ButtonProps = DetailedHTMLProps<HTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

/**
 * Props for the `Button` component.
 *
 * - `label`: Button text.
 * - `type`: Required visual and behavioral modifier:
 *   - `'primary'`: Red background button (e.g. product card, cart).
 *   - `'login'`: Login button style.
 *   - `'topNav'`: Top navigation menu button.
 *   - `'inCart'`: “Add to cart” button from the main menu.
 *   - `'inActive'`: Fully disabled state.
 *   - `'waiting'`: Temporarily inactive (e.g. waiting for SMS resend).
 *   - `'cancel'`: Secondary/cancel action.
 *
 * ---
 * Пропсы для компонента `Button`.
 *
 * - `label`: Текст кнопки.
 * - `type`: Обязательный модификатор внешнего вида и поведения:
 *   - `'primary'`: Кнопка с красным фоном (карточка товара, корзина и т.д.).
 *   - `'login'`: Стиль кнопки входа.
 *   - `'topNav'`: Кнопка верхнего меню.
 *   - `'inCart'`: Кнопка «в корзину» из главного меню.
 *   - `'inActive'`: Полностью неактивное состояние.
 *   - `'waiting'`: Временно неактивна (например, ожидание повтора отправки СМС).
 *   - `'cancel'`: Альтернативное действие / отмена.
 */
export type ButtonComponentProps = ButtonProps & {
  label: string;
  type:
    | 'login'
    | 'topNav'
    | 'primary'
    | 'inCart'
    | 'inActive'
    | 'waiting'
    | 'cancel'
    | 'primaryCheckout'
    | 'secondaryCheckout'
    | 'rule';
};
