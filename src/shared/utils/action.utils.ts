import { ActionResult, ErrorCode, errorMessages } from '@/src/shared/types';

export function actionSuccess<T>(data: T): ActionResult<T> {
  return { ok: true, data };
}

export function actionError<T>(
  code: ErrorCode,
  options?: {
    details?: unknown;
  },
): ActionResult<T> {
  const { details } = options || {};
  return {
    ok: false,
    code,
    message: errorMessages[code],
    options: {
      ...(details ? { details } : {}),
    },
  };
}
