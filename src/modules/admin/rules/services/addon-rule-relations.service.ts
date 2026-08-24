import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { actionSuccess } from 'modules/admin/shared/utils/action.utils';
import { addonRuleRelationsRepository } from 'modules/admin/rules/repository';
import {
  AddonRuleAddonProductRelation,
  AddonRuleTargetProductRelation,
  AddonRuleTargetCategoryRelation,
} from 'modules/admin/rules/entities';

export const addonRuleRelationsService = {
  addonProducts: {
    async syncAddonProductsRelation(
      addonRuleId: number,
      productIds: number[],
      mode: 'insert' | 'update',
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<AddonRuleAddonProductRelation[]>> {
      if (mode === 'update') {
        const deleteResult = await addonRuleRelationsRepository.addonProducts.deleteMany(addonRuleId, executor);

        if (!deleteResult.ok) return deleteResult;
      }

      if (productIds.length === 0) return actionSuccess([]);

      return addonRuleRelationsRepository.addonProducts.insertMany(addonRuleId, productIds, executor);
    },

    async syncDeleteAddonProductsRelation(
      addonRuleId: number,
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<null>> {
      return await addonRuleRelationsRepository.addonProducts.deleteMany(addonRuleId, executor);
    },
  },
  targetCategories: {
    async syncTargetCategoriesRelation(
      addonRuleId: number,
      categoryIds: number[],
      mode: 'insert' | 'update',
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<AddonRuleTargetCategoryRelation[]>> {
      if (mode === 'update') {
        const deleteResult = await addonRuleRelationsRepository.targetCategories.deleteMany(addonRuleId, executor);

        if (!deleteResult.ok) return deleteResult;
      }

      if (categoryIds.length === 0) return actionSuccess([]);

      return addonRuleRelationsRepository.targetCategories.insertMany(addonRuleId, categoryIds, executor);
    },

    async syncDeleteTargetCategoriesRelation(
      addonRuleId: number,
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<null>> {
      return await addonRuleRelationsRepository.targetCategories.deleteMany(addonRuleId, executor);
    },
  },
  targetProducts: {
    async syncTargetProductsRelation(
      addonRuleId: number,
      productIds: number[],
      mode: 'insert' | 'update',
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<AddonRuleTargetProductRelation[]>> {
      if (mode === 'update') {
        const deleteResult = await addonRuleRelationsRepository.targetProducts.deleteMany(addonRuleId, executor);

        if (!deleteResult.ok) return deleteResult;
      }

      if (productIds.length === 0) return actionSuccess([]);

      return addonRuleRelationsRepository.targetProducts.insertMany(addonRuleId, productIds, executor);
    },

    async syncDeleteTargetProductsRelation(
      addonRuleId: number,
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<null>> {
      return await addonRuleRelationsRepository.targetProducts.deleteMany(addonRuleId, executor);
    },
  },
};
