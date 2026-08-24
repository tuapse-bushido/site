import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { addonRuleRepo } from 'modules/admin/rules/repository';
import { AddonRule, UpsertAddonRule } from 'modules/admin/rules/entities';

export const addonRuleService = {
  async syncAddonRule(
    addonRule: UpsertAddonRule,
    mode: 'insert' | 'update',
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<AddonRule>> {
    const { id, ...baseData } = addonRule;

    if (mode === 'update') {
      if (id === undefined) {
        throw new Error('ID is required for update mode');
      }

      return addonRuleRepo.updateAddonRule({ ...baseData, id }, executor);
    }

    return addonRuleRepo.insertAddonRule(baseData, executor);
  },

  async syncDeleteAddonRule(id: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
    return addonRuleRepo.deleteAddonRule(id, executor);
  },
};
