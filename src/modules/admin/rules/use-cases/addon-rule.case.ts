import { getAllProducts } from 'modules/admin/menu/products/repository';
import { getAllCategories } from 'modules/admin/menu/categories';
import { actionError, actionSuccess, unwrap } from 'modules/admin/shared/utils/action.utils';
import { addonRuleRepo } from 'modules/admin/rules/repository/addon-rule.repository';
import { ErrorCode } from 'shared/types/error-codes.types';
import { ActionResult } from 'shared/types/action.types';
import { AddonRule, AddonRuleDetail, AddonRuleEditData } from 'modules/admin/rules/entities';
import { UpsertAddonRuleForm } from 'modules/admin/rules/features/addon-rule-form/model';
import { pool } from 'shared/configs/db';
import { addonRulesService } from 'modules/admin/rules/services/addon-rules.service';

export const getAddonRuleEditData = async (id?: number): Promise<ActionResult<AddonRuleEditData>> => {
  try {
    const [categories, products] = await Promise.all([getAllCategories().then(unwrap), getAllProducts().then(unwrap)]);

    let addonRule: AddonRuleDetail | undefined;

    if (id) {
      addonRule = await addonRuleRepo.rule.getAddonRuleById(id).then(unwrap);
    }

    return actionSuccess({ categories, products, addonRule });
  } catch (error) {
    console.error(error);
    return actionError(ErrorCode.DB_ERROR);
  }
};

export const upsertAddonRuleCase = async (
  addonRule: UpsertAddonRuleForm,
  mode: 'insert' | 'update',
): Promise<ActionResult<AddonRule>> => {
  const client = await pool.connect();

  const { addons, categories, products } = addonRule;

  try {
    await client.query('BEGIN');

    const ruleResponse = await addonRulesService.syncAddonRule(addonRule, mode, client);
    if (!ruleResponse.ok) {
      await client.query('ROLLBACK');
      return ruleResponse;
    }

    const ruleId = ruleResponse.data.id;

    await Promise.all([
      addonRulesService.syncAddons(ruleId, addons, mode, client),
      addonRulesService.syncCategories(ruleId, categories, mode, client),
      addonRulesService.syncProducts(ruleId, products, mode, client),
    ]);

    await client.query('COMMIT');
    return ruleResponse;
  } catch (error) {
    await client.query('ROLLBACK');
    console.error(error);
    return actionError(ErrorCode.DB_ERROR);
  } finally {
    client.release();
  }
};
