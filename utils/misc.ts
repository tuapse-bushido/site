import { CartState } from '@/types';
import { FullOrder } from '@/types/db/composite/full-order';

export const getImageUrl = (path: string | null): string => {
  const newPath = path === null ? 'no_image.png' : path;
  return `${process.env.NEXT_PUBLIC_IMAGES_DOMAIN}/${newPath}`;
};

/**
 * Enum representing all possible error codes for actions.
 *
 * ---
 *
 * Перечисление возможных кодов ошибок при действиях.
 */
export enum ErrorCode {
  DUPLICATE = 'duplicate',

  DB_ERROR = 'db_error',
  NOT_FOUND = 'not_found',
  INVALID_INPUT = 'invalid_input',
  UNAUTHORIZED = 'unauthorized',
  VALIDATION_FAILED = 'validation_failed',
  CONFLICT = 'conflict',
}

/**
 * Mapping of error codes to user-friendly error messages.
 *
 * ---
 *
 * Соответствие кодов ошибок понятным текстовым сообщениям.
 */
export const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.DUPLICATE]: 'Данные с таким названием уже существуют',

  [ErrorCode.DB_ERROR]: 'Ошибка соединения, попробуйте позже.',
  [ErrorCode.NOT_FOUND]: 'Запрашиваемый ресурс не найден.',
  [ErrorCode.INVALID_INPUT]: 'Введены некорректные данные.',
  [ErrorCode.UNAUTHORIZED]: 'Доступ запрещён.',
  [ErrorCode.VALIDATION_FAILED]: 'Ошибка валидации.',
  [ErrorCode.CONFLICT]: 'Конфликт данных, операция невозможна.',
};

/**
 * Successful result of an action.
 *
 * ---
 *
 * Успешный результат действия.
 *
 * @template T - Тип возвращаемых данных
 */
export type ActionSuccess<T> = {
  success: true;
  code: 'ok';
  data: T;
};

/**
 * Failed result of an action.
 *
 * ---
 *
 * Ошибка при выполнении действия.
 */
export type ActionError = {
  success: false;
  code: ErrorCode;
  message: string;
};

/**
 * Union type representing either a successful or failed action result.
 *
 * ---
 *
 * Результат действия — успешный или с ошибкой.
 */
export type ActionResult<T> = ActionSuccess<T> | ActionError;

/**
 * Creates a successful action result object.
 *
 * ---
 *
 * Создаёт объект успешного результата действия.
 *
 * @template T - Тип возвращаемых данных
 * @param {T} data - Данные, возвращаемые действием
 * @returns {ActionResult<T>} Успешный результат
 *
 * @example
 * return actionResult({ id: 1, name: 'Test' });
 */
export function actionResult<T>(data: T): ActionResult<T> {
  return {
    success: true,
    code: 'ok',
    data,
  };
}

/**
 * Creates a failed action result object.
 *
 * ---
 *
 * Создаёт объект результата действия с ошибкой.
 *
 * @template T - Тип, возвращаемый в случае ошибки (обычно `never`)
 * @param {ErrorCode} code - Код ошибки
 * @returns {ActionResult<T>} Ошибочный результат
 *
 * @example
 * return errorResult(ErrorCode.NOT_FOUND);
 */
export function errorResult<T = never>(code: ErrorCode): ActionResult<T> {
  return {
    success: false,
    code,
    message: errorMessages[code] || 'Неизвестная ошибка',
  };
}

// noinspection NonAsciiCharacters
const cyrillicToLatinMap: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'zh',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'kh',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  щ: 'shch',
  ъ: '',
  ы: 'y',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
};

/**
 * Converts Cyrillic text to a URL-friendly Latin transliteration.
 *
 * Replaces all Cyrillic characters with Latin equivalents, normalizes the string,
 * replaces any non-alphanumeric characters with underscores, and lowercases the result.
 *
 * ---
 *
 * Преобразует кириллический текст в латинскую транслитерацию, подходящую для URL.
 *
 * Заменяет символы кириллицы на латиницу, нормализует строку, заменяет все
 * не-алфавитные символы на подчёркивания и приводит к нижнему регистру.
 *
 * @param {string} text - Input text in Cyrillic
 * @returns {string} Transliterated and normalized string
 *
 * @example
 * transliterate('Суши и роллы') // → 'sushi_i_rolly'
 */
export const transliterate = (text: string): string => {
  return text
    .split('')
    .map((char): string => {
      const lowerChar = char.toLowerCase();
      return cyrillicToLatinMap[lowerChar] !== undefined ? cyrillicToLatinMap[lowerChar] : char;
    })
    .join('')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .toLowerCase();
};

/**
 * Calculates the total price of all items and paid addons in the cart.
 *
 * Addons are included in the total only if they exceed their free quantity limit.
 *
 * ---
 *
 * Подсчитывает общую стоимость всех товаров и платных добавок в корзине.
 *
 * Добавки учитываются только в той части, которая превышает лимит бесплатных.
 *
 * @param {CartState} cart - Current cart state
 * @returns {number} Total price in rubles
 *
 * @example
 * const total = getTotalPriceInCart(cartState);
 */
export const getTotalPriceInCart = (cart: CartState): number => {
  const { items, addons = {} } = cart;

  const itemsTotalPrice = Object.values(items).reduce((acc, cur): number => acc + cur.price * cur.quantity_in_cart, 0);
  const addonsTotalPrice = Object.values(addons).reduce((acc, cur): number => {
    if (cur.max_free_quantity < cur.quantity_in_cart) {
      acc = acc + (cur.quantity_in_cart - cur.max_free_quantity) * cur.addon_product.price;
    }
    return acc;
  }, 0);

  return itemsTotalPrice + addonsTotalPrice;
};

/**
 * Order info labels in Russian for display in UI.
 *
 * Used to map order enums (status, type, payment type/status) to readable strings.
 *
 * ---
 *
 * Подписи для отображения информации о заказе на русском.
 *
 * Используется для перевода enum-значений статуса, типа и оплаты заказа.
 */
const orderInfo = {
  status: {
    new: 'Новый заказ',
    in_progress: 'В работе',
    sent: 'Отправлен',
    done: 'Завершен',
    canceled: 'Отменен',
  },
  orderType: {
    delivery: 'Доставка',
    pickup: 'Самовывоз',
  },
  paymentType: { courier: 'Оплата курьеру', pickup: 'Оплата при самовывозе' },
  paymentStatus: { paid: 'Оплачен', not_paid: 'Не оплачен' },
};

type FormatOrder = {
  date: string;
  time: string;
  status: string;
  orderType: string;
  paymentType: string;
  paymentStatus: string;
  address: string;
};

/**
 * Formats full order data into display-ready strings.
 *
 * Extracts and formats the date, time, status, payment details, and address.
 *
 * ---
 *
 * Форматирует заказ для отображения.
 *
 * Преобразует дату, статус, тип и адрес заказа в строки для вывода.
 *
 * @param {FullOrder} order - Полная информация о заказе
 * @returns {FormatOrder} Объект с форматированными строками для вывода
 *
 * @example
 * const info = formatOrderInfo(order);
 * console.log(info.status); // → "Новый заказ"
 */
export const formatOrderInfo = (order: FullOrder): FormatOrder => {
  const fullDate = new Date(order.created_at);
  const time = new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(fullDate);

  const date = new Intl.DateTimeFormat('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(fullDate);

  const status = orderInfo.status[order.status];
  const orderType = orderInfo.orderType[order.order_type];
  const paymentType = orderInfo.paymentType[order.payment_type];
  const paymentStatus = orderInfo.paymentStatus[order.payment_status];

  const addressParts = [
    `${order.address_city}, ул. ${order.address_street}, д. ${order.address_house}`,
    order.address_apartment && `кв. ${order.address_apartment}`,
    order.address_floor && `этаж ${order.address_floor}`,
    order.address_entrance && `подъезд ${order.address_entrance}`,
    order.address_intercom && `домофон ${order.address_intercom}`,
  ];

  const address = addressParts.filter(Boolean).join(', ');

  return {
    date,
    time,
    status,
    orderType,
    paymentType,
    paymentStatus,
    address,
  };
};
