import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { addonRuleRepo } from 'modules/admin/rules/repository';
import { actionSuccess } from 'modules/admin/shared/utils/action.utils';
import { Addon, AddonRule, RuleToCategory, RuleToProduct } from 'modules/admin/rules/entities';
import { UpsertAddonRuleForm } from 'modules/admin/rules/features/addon-rule-form/model';

export const addonRulesService = {
  async syncAddonRule(
    addonRule: UpsertAddonRuleForm,
    mode: 'insert' | 'update',
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<AddonRule>> {
    const { id, title, base_count, divisor, show_count_percent, is_active } = addonRule;

    const baseData = { title, base_count, divisor, show_count_percent, is_active };

    if (mode === 'update') {
      if (id === undefined) {
        throw new Error('ID is required for update mode');
      }

      return await addonRuleRepo.rule.updateAddonRule({ ...baseData, id }, executor);
    }

    return await addonRuleRepo.rule.insertAddonRule(baseData, executor);
  },

  async syncDeleteAddonRule(id: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
    return await addonRuleRepo.rule.deleteAddonRule(id, executor);
  },

  async syncAddons(
    ruleId: number,
    addonsId: number[],
    mode: 'insert' | 'update',
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<Addon[] | null>> {
    if (mode === 'update') {
      await addonRuleRepo.addons.deleteAddonMany(ruleId, executor);
    }

    if (!addonsId?.length) return actionSuccess(null);

    return addonRuleRepo.addons.insertAddonMany(ruleId, addonsId, executor);
  },

  async syncCategories(
    ruleId: number,
    categoriesId: number[],
    mode: 'insert' | 'update',
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<RuleToCategory[] | null>> {
    if (mode === 'update') {
      await addonRuleRepo.categories.deleteRuleToCategoryMany(ruleId, executor);
    }

    if (!categoriesId?.length) return actionSuccess(null);

    return addonRuleRepo.categories.insertRuleToCategoryMany(ruleId, categoriesId, executor);
  },

  async syncProducts(
    ruleId: number,
    productsId: number[],
    mode: 'insert' | 'update',
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<RuleToProduct[] | null>> {
    if (mode === 'update') {
      await addonRuleRepo.products.deleteRuleToProductMany(ruleId, executor);
    }

    if (!productsId?.length) return actionSuccess(null);

    return addonRuleRepo.products.insertRuleToProductMany(ruleId, productsId, executor);
  },
};
