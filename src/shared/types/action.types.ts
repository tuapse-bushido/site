import { ErrorCode } from './error-codes.types';

export type ActionResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: ErrorCode; message: string; options: { details?: unknown } };
