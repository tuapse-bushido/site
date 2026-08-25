import { z, ZodType } from 'zod';
import { pool } from 'shared/configs/db';
import { logger } from 'shared/utils/logger';
import { DatabaseError, PoolClient } from 'pg';
import { ActionResult } from 'shared/types/action.types';
import { ErrorCode } from 'shared/types/error-codes.types';
import { actionError, actionSuccess } from 'modules/admin/shared/utils/action.utils';

export const handleDbError = <T>(err: unknown, query: string, params: unknown[]): ActionResult<T> => {
  if (err instanceof DatabaseError) {
    switch (err.code) {
      case '23505': {
        const fieldName = err.detail?.match(/\((.*?)\)/)?.[1] || 'unknown';
        logger.info({ msg: 'DB_DUPLICATE_KEY', field: fieldName, detail: err.detail });
        return actionError(ErrorCode.DUPLICATE, {
          details: { conflictField: fieldName },
        });
      }

      case '23503': {
        logger.warn({ msg: 'DB_FOREIGN_KEY_VIOLATION', detail: err.detail, query });
        return actionError(ErrorCode.CONFLICT);
      }

      case '23502': {
        logger.error({ msg: 'DB_NOT_NULL_VIOLATION', column: err.column, query, params });
        return actionError(ErrorCode.DB_ERROR);
      }

      default: {
        logger.error({
          msg: 'DB_UNHANDLED_ERROR',
          code: err.code,
          error: err.message,
          query: query.trim().replace(/\s+/g, ' '),
          params,
        });
        return actionError(ErrorCode.DB_ERROR);
      }
    }
  }

  logger.fatal({ msg: 'UNKNOWN_DB_ERROR', error: err, query });
  return actionError(ErrorCode.UNKNOWN);
};

export const dbQuery = async <T extends ZodType>(
  query: string,
  params: unknown[] = [],
  schema: T,
  mode: 'single' | 'multiple' = 'single',
  executor: PoolClient | typeof pool = pool,
): Promise<ActionResult<z.infer<T>>> => {
  try {
    const { rows, rowCount } = await executor.query(query, params);

    if (!rowCount && mode === 'single' && query.trim().toUpperCase().startsWith('SELECT')) {
      return actionError(ErrorCode.NOT_FOUND);
    }

    const data = mode === 'single' ? rows[0] : rows;
    const result = schema.safeParse(data);

    if (!result.success) {
      logger.error({
        msg: 'DB_OUTPUT_VALIDATION_FAILED',
        error: z.flattenError(result.error),
        query,
        params,
      });
      return actionError(ErrorCode.DB_ERROR);
    }

    return actionSuccess(result.data);
  } catch (err) {
    return handleDbError(err, query, params);
  }
};

export const dbDelete = async (
  query: string,
  params: unknown[] = [],
  executor: PoolClient | typeof pool = pool,
  options: { strict?: boolean } = { strict: true },
): Promise<ActionResult<null>> => {
  try {
    const { rowCount } = await executor.query(query, params);

    if (options.strict && rowCount === 0) {
      logger.warn({ msg: 'DB_DELETE_NOT_FOUND', query, params });
      return actionError(ErrorCode.NOT_FOUND);
    }
    return actionSuccess(null);
  } catch (err) {
    return handleDbError(err, query, params);
  }
};

export const dbCommand = async (
  query: string,
  params: unknown[] = [],
  executor: PoolClient | typeof pool = pool,
  options: { strict?: boolean } = { strict: true },
): Promise<ActionResult<null>> => {
  try {
    const { rowCount } = await executor.query(query, params);

    if (options.strict && rowCount === 0) {
      logger.warn({ msg: 'DB_COMMAND_NOT_APPLIED', query, params });
      return actionError(ErrorCode.NOT_FOUND);
    }

    return actionSuccess(null);
  } catch (error) {
    return handleDbError(error, query, params);
  }
};
