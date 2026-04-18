/**
 * Enum representing all possible error codes for actions.
 *
 * ---
 * Перечисление возможных кодов ошибок при действиях.
 */
export enum ErrorCode {
  UNAUTHORIZED = 'unauthorized',
  INVALID_INPUT = 'invalid_input',
  INVALID_CREDENTIALS = 'invalid_credentials',

  // Что используется
  NOT_FOUND = 'not_found',
  DB_ERROR = 'db_error',
  DUPLICATE = 'duplicate',
  CONFLICT = 'conflict',
  VALIDATION_FAILED = 'validation_failed',
  UNKNOWN = 'unknown',
}

/**
 * Mapping of error codes to user-friendly error messages.
 *
 * ---
 * Соответствие кодов ошибок понятным текстовым сообщениям.
 */
export const errorMessages: Record<ErrorCode, string> = {
  [ErrorCode.UNAUTHORIZED]: 'Доступ запрещён. Пожалуйста, авторизуйтесь',
  [ErrorCode.INVALID_INPUT]: 'Введены некорректные данные',
  [ErrorCode.INVALID_CREDENTIALS]: 'Неверный логин или пароль',

  // Актуальные для текущей логики
  [ErrorCode.NOT_FOUND]: 'Запрашиваемая запись не найдена',
  [ErrorCode.DB_ERROR]: 'Сервис временно недоступен. Попробуйте позже',
  [ErrorCode.DUPLICATE]: 'Запись с такими данными уже существует',
  [ErrorCode.CONFLICT]: 'Удаление невозможно: запись используется в других разделах',
  [ErrorCode.VALIDATION_FAILED]: 'Проверьте правильность заполнения полей',
  [ErrorCode.UNKNOWN]: 'Произошла непредвиденная ошибка',
};
