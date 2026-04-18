import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { ingredientRepo } from 'modules/admin/menu/ingredients/repository';
import { Ingredient, UpsertIngredient } from 'modules/admin/menu/ingredients/entities';

export const ingredientService = {
  async syncIngredient(
    ingredient: UpsertIngredient,
    mode: 'insert' | 'update',
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<Ingredient>> {
    const { id, title } = ingredient;

    if (mode === 'update') {
      if (id === undefined) {
        throw new Error('ID is required for update mode');
      }
      return await ingredientRepo.updateIngredient({ id, title }, executor);
    }
    return await ingredientRepo.insertIngredient(ingredient, executor);
  },

  async syncDeleteIngredient(id: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
    return await ingredientRepo.deleteIngredient(id, executor);
  },
};
