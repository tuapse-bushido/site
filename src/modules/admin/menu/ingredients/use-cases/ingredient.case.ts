import { pool } from 'shared/configs/db';
import { logger } from 'shared/utils/logger';
import { ActionResult } from 'shared/types/action.types';
import { ErrorCode } from 'shared/types/error-codes.types';
import { actionError } from 'modules/admin/shared/utils/action.utils';
import { ingredientService } from 'modules/admin/menu/ingredients/services';
import { Ingredient, UpsertIngredient } from 'modules/admin/menu/ingredients/entities';

export const ingredientCases = {
  async upsertIngredientCase(
    ingredient: UpsertIngredient,
    mode: 'insert' | 'update',
  ): Promise<ActionResult<Ingredient>> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const response = await ingredientService.syncIngredient(ingredient, mode, client);

      if (!response.ok) {
        await client.query('ROLLBACK');
        return response;
      }

      await client.query('COMMIT');

      return response;
    } catch (error) {
      await client.query('ROLLBACK');

      logger.error({
        msg: 'UPSERT_INGREDIENT_TRANSACTION_FAILED',
        ingredient,
        mode,
        error: error instanceof Error ? error.message : error,
      });

      return actionError(ErrorCode.UNKNOWN);
    } finally {
      client.release();
    }
  },
};
