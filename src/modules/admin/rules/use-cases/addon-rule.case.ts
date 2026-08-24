import { pool } from 'shared/configs/db';
import { logger } from 'shared/utils/logger';
import { ActionResult } from 'shared/types/action.types';
import { ErrorCode } from 'shared/types/error-codes.types';
import { productRepo } from 'modules/admin/menu/products/repository';
import { categoryRepo } from 'modules/admin/menu/categories/repository';
import { addonRuleRepo } from 'modules/admin/rules/repository';
import { addonRuleRelationsService, addonRuleService } from 'modules/admin/rules/services';
import { actionError, actionSuccess } from 'modules/admin/shared/utils/action.utils';
import { AddonRule, AddonRuleEditData, UpsertFormAddonRule } from 'modules/admin/rules/entities';

export const addonRuleCases = {
  async getAddonRuleEditData(id?: number): Promise<ActionResult<AddonRuleEditData>> {
    try {
      const [categoriesResult, productsResult, addonRuleResult] = await Promise.all([
        categoryRepo.getAllCategories(),
        productRepo.getAllProducts(),
        id === undefined ? Promise.resolve(null) : addonRuleRepo.getAddonRuleWithDetails(id),
      ]);

      if (addonRuleResult && !addonRuleResult.ok) {
        logger.warn({
          msg: 'ADDON_RULE_EDIT_LOAD_FAILED',
          addonRuleId: id,
          code: addonRuleResult.code,
          details: addonRuleResult.options.details,
        });

        return actionError(addonRuleResult.code === ErrorCode.NOT_FOUND ? ErrorCode.NOT_FOUND : ErrorCode.DB_ERROR);
      }

      if (!categoriesResult.ok || !productsResult.ok) {
        logger.error({
          msg: 'ADDON_RULE_EDIT_OPTIONS_LOAD_FAILED',
          addonRuleId: id,
          errors: {
            categories: categoriesResult.ok ? null : categoriesResult.code,
            products: productsResult.ok ? null : productsResult.code,
          },
        });

        return actionError(ErrorCode.DB_ERROR);
      }

      const baseData = {
        categories: categoriesResult.data,
        products: productsResult.data,
      };

      if (!addonRuleResult) {
        return actionSuccess(baseData);
      }

      return actionSuccess({
        ...baseData,
        addonRule: addonRuleResult.data,
      });
    } catch (error) {
      logger.error({
        msg: 'ADDON_RULE_EDIT_UNEXPECTED_FAILURE',
        addonRuleId: id,
        error: error instanceof Error ? error.message : error,
      });

      return actionError(ErrorCode.UNKNOWN);
    }
  },

  async upsertAddonRuleCase(
    addonRule: UpsertFormAddonRule,
    mode: 'insert' | 'update',
  ): Promise<ActionResult<AddonRule>> {
    const client = await pool.connect();
    const { addons, categories, products, ...rule } = addonRule;

    try {
      await client.query('BEGIN');

      const ruleResult = await addonRuleService.syncAddonRule(rule, mode, client);

      if (!ruleResult.ok) {
        await client.query('ROLLBACK');
        return ruleResult;
      }

      const addonRuleId = ruleResult.data.id;
      const relationOperations = [
        {
          field: 'addons',
          ids: addons,
          sync: (ids: number[]): ReturnType<typeof addonRuleRelationsService.addonProducts.syncAddonProductsRelation> =>
            addonRuleRelationsService.addonProducts.syncAddonProductsRelation(addonRuleId, ids, mode, client),
        },
        {
          field: 'categories',
          ids: categories,
          sync: (
            ids: number[],
          ): ReturnType<typeof addonRuleRelationsService.targetCategories.syncTargetCategoriesRelation> =>
            addonRuleRelationsService.targetCategories.syncTargetCategoriesRelation(addonRuleId, ids, mode, client),
        },
        {
          field: 'products',
          ids: products,
          sync: (
            ids: number[],
          ): ReturnType<typeof addonRuleRelationsService.targetProducts.syncTargetProductsRelation> =>
            addonRuleRelationsService.targetProducts.syncTargetProductsRelation(addonRuleId, ids, mode, client),
        },
      ] as const;

      for (const operation of relationOperations) {
        if (mode === 'insert' && operation.ids === null) {
          continue;
        }

        const relationResult = await operation.sync(operation.ids ?? []);

        if (!relationResult.ok) {
          await client.query('ROLLBACK');

          return actionError(relationResult.code, {
            details: {
              field: operation.field,
              cause: relationResult.options.details,
            },
          });
        }
      }

      await client.query('COMMIT');

      return ruleResult;
    } catch (error) {
      await client.query('ROLLBACK');
      logger.error({
        msg: 'UPSERT_ADDON_RULE_TRANSACTION_FAILED',
        data: addonRule,
        mode,
        error: error instanceof Error ? error.message : error,
      });
      return actionError(ErrorCode.DB_ERROR);
    } finally {
      client.release();
    }
  },

  async deleteAddonRuleCase(addonRuleId: number): Promise<ActionResult<null>> {
    const client = await pool.connect();

    try {
      await client.query('BEGIN');

      const deleteOperations = [
        {
          field: 'addonProducts',
          execute: (): Promise<ActionResult<null>> =>
            addonRuleRelationsService.addonProducts.syncDeleteAddonProductsRelation(addonRuleId, client),
        },
        {
          field: 'targetCategories',
          execute: (): Promise<ActionResult<null>> =>
            addonRuleRelationsService.targetCategories.syncDeleteTargetCategoriesRelation(addonRuleId, client),
        },
        {
          field: 'targetProducts',
          execute: (): Promise<ActionResult<null>> =>
            addonRuleRelationsService.targetProducts.syncDeleteTargetProductsRelation(addonRuleId, client),
        },
      ] as const;

      for (const operation of deleteOperations) {
        const result = await operation.execute();

        if (!result.ok) {
          await client.query('ROLLBACK');

          return actionError(result.code, {
            details: {
              field: operation.field,
              cause: result.options.details,
            },
          });
        }
      }

      const deleteRuleResult = await addonRuleService.syncDeleteAddonRule(addonRuleId, client);

      if (!deleteRuleResult.ok) {
        await client.query('ROLLBACK');
        return deleteRuleResult;
      }

      await client.query('COMMIT');

      return actionSuccess(null);
    } catch (error) {
      await client.query('ROLLBACK');

      logger.error({
        msg: 'DELETE_PRODUCT_TRANSACTION_FAILED',
        addonRuleId,
        error: error instanceof Error ? error.message : error,
      });

      return actionError(ErrorCode.UNKNOWN);
    } finally {
      client.release();
    }
  },
};
