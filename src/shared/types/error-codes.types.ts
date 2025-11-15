/**
 * Enum representing all possible error codes for actions.
 *
 * ---
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
  UNKNOWN = 'unknown',

  INVALID_CREDENTIALS = 'invalid_credentials',
}

/**
 * Mapping of error codes to user-friendly error messages.
 *
 * ---
 * Соответствие кодов ошибок понятным текстовым сообщениям.
 */
export const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.DUPLICATE]: 'Данные с таким названием уже существуют',
  [ErrorCode.DB_ERROR]: 'Ошибка соединения с базой данных, попробуйте позже',
  [ErrorCode.NOT_FOUND]: 'Запрашиваемый ресурс не найден',
  [ErrorCode.UNAUTHORIZED]: 'Доступ запрещён',
  [ErrorCode.VALIDATION_FAILED]: 'Ошибка валидации данных',
  [ErrorCode.CONFLICT]: 'Конфликт данных, операция невозможна',
  [ErrorCode.UNKNOWN]: 'Неизвестная ошибка',

  [ErrorCode.INVALID_INPUT]: 'Введены некорректные данные',

  [ErrorCode.INVALID_CREDENTIALS]: 'Неверный логин или пароль',
};
