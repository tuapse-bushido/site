import { pool } from 'shared/configs/db';
import { logger } from 'shared/utils/logger';
import { ActionResult } from 'shared/types/action.types';
import { ErrorCode } from 'shared/types/error-codes.types';
import { actionError } from 'modules/admin/shared/utils/action.utils';
import { categoryService } from 'modules/admin/menu/categories/services';
import { Category, UpsertCategory } from 'modules/admin/menu/categories/entities';

export const categoryCases = {
  async upsertCategoryCase(category: UpsertCategory, mode: 'insert' | 'update'): Promise<ActionResult<Category>> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const response = await categoryService.syncCategory(category, mode, client);

      if (!response.ok) {
        await client.query('ROLLBACK');
        return response;
      }

      await client.query('COMMIT');

      return response;
    } catch (error) {
      await client.query('ROLLBACK');

      logger.error({
        msg: 'UPSERT_CATEGORY_TRANSACTION_FAILED',
        category,
        mode,
        error: error instanceof Error ? error.message : error,
      });

      return actionError(ErrorCode.UNKNOWN);
    } finally {
      client.release();
    }
  },
};
