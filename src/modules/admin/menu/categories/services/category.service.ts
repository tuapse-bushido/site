import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { Category, UpsertCategory } from 'modules/admin/menu/categories/entities';
import { categoryRepo } from 'modules/admin/menu/categories/repository';

export const categoryService = {
  async syncCategory(
    category: UpsertCategory,
    mode: 'insert' | 'update',
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<Category>> {
    const { id, ...all } = category;

    if (mode === 'update') {
      if (id === undefined) {
        throw new Error('ID is required for update mode');
      }
      return await categoryRepo.updateCategory({ id, ...all }, executor);
    }
    return await categoryRepo.insertCategory(category, executor);
  },

  async syncDeleteCategory(id: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
    return await categoryRepo.categoryDelete(id, executor);
  },
};
