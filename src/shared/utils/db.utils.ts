import { z, ZodType } from 'zod';
import { DatabaseError } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { ErrorCode } from 'shared/types/error-codes.types';
import { actionError, actionSuccess } from './action.utils';

export const dbQuery = async <T extends ZodType>(
  query: string,
  params: unknown[] = [],
  schema: T,
  mode: 'single' | 'multiple' = 'single',
): Promise<ActionResult<z.infer<T>>> => {
  try {
    const { rows, rowCount } = await pool.query(query, params);

    if (rowCount === 0) return actionError(ErrorCode.NOT_FOUND);

    const data = mode === 'single' ? rows[0] : rows;

    const result = schema.safeParse(data);

    if (!result.success) return actionError(ErrorCode.VALIDATION_FAILED);

    return actionSuccess(result.data);
  } catch (err) {
    return actionError(ErrorCode.DB_ERROR, { details: err });
  }
};

export const dbExecute = async <T>(query: string, params: unknown[] = []): Promise<ActionResult<T>> => {
  try {
    const { rows } = await pool.query(query, params);

    return actionSuccess(rows[0]);
  } catch (err) {
    if (err instanceof DatabaseError) {
      switch (err.code) {
        case '23505':
          return actionError(ErrorCode.DUPLICATE, { details: err });
        default:
          return actionError(ErrorCode.DB_ERROR, { details: err });
      }
    }

    return actionError(ErrorCode.UNKNOWN, { details: err });
  }
};

export const dbDelete = async (query: string, params: unknown[] = []): Promise<ActionResult<null>> => {
  try {
    const { rowCount } = await pool.query(query, params);

    if (rowCount === 0) {
      return actionError(ErrorCode.NOT_FOUND);
    }

    return actionSuccess(null);
  } catch (err) {
    if (err instanceof DatabaseError) {
      return actionError(ErrorCode.DB_ERROR, { details: err });
    }

    return actionError(ErrorCode.UNKNOWN, { details: err });
  }
};
