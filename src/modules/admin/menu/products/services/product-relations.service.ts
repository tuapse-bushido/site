import {
  ProductCategoryRelation,
  ProductIngredientRelation,
  ProductSetItemRelation,
} from 'modules/admin/menu/products/entities';
import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { productRelationsRepo } from 'modules/admin/menu/products/repository';
import { actionSuccess } from 'modules/admin/shared/utils/action.utils';

export const productRelationsService = {
  ingredients: {
    async syncIngredientsRelation(
      productId: number,
      ids: number[],
      mode: 'insert' | 'update',
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<ProductIngredientRelation[]>> {
      if (mode === 'update') {
        const deleteResult = await productRelationsRepo.ingredients.deleteMany(productId, executor);

        if (!deleteResult.ok) {
          return deleteResult;
        }
      }

      if (ids.length === 0) {
        return actionSuccess([]);
      }

      return productRelationsRepo.ingredients.insertMany(productId, ids, executor);
    },

    async syncDeleteIngredientsRelation(
      id: number,
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<null>> {
      return await productRelationsRepo.ingredients.deleteMany(id, executor);
    },
  },
  categories: {
    async syncCategoriesRelation(
      productId: number,
      ids: number[],
      mode: 'insert' | 'update',
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<ProductCategoryRelation[]>> {
      if (mode === 'update') {
        const deleteResult = await productRelationsRepo.categories.deleteMany(productId, executor);

        if (!deleteResult.ok) {
          return deleteResult;
        }
      }

      if (ids.length === 0) {
        return actionSuccess([]);
      }

      return productRelationsRepo.categories.insertMany(productId, ids, executor);
    },

    async syncDeleteCategoriesRelation(
      id: number,
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<null>> {
      return await productRelationsRepo.categories.deleteMany(id, executor);
    },
  },
  setItems: {
    async syncSetItemsRelation(
      productId: number,
      ids: number[],
      mode: 'insert' | 'update',
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<ProductSetItemRelation[]>> {
      if (mode === 'update') {
        const deleteResult = await productRelationsRepo.setItems.deleteMany(productId, executor);

        if (!deleteResult.ok) {
          return deleteResult;
        }
      }

      if (ids.length === 0) {
        return actionSuccess([]);
      }

      return productRelationsRepo.setItems.insertMany(productId, ids, executor);
    },

    async syncDeleteSetItemsRelation(
      id: number,
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<null>> {
      return await productRelationsRepo.setItems.deleteMany(id, executor);
    },
  },
};
