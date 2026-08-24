import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { dbDelete, dbQuery } from 'shared/utils/db.utils';
import {
  addonRuleSchemas as schemas,
  AddonRuleAddonProductRelation,
  AddonRuleTargetProductRelation,
  AddonRuleTargetCategoryRelation,
} from 'modules/admin/rules/entities';

export const addonRuleRelationsRepository = {
  addonProducts: {
    async insertMany(
      addonRuleId: number,
      productIds: number[],
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<AddonRuleAddonProductRelation[]>> {
      const query = `
          INSERT INTO addon_rule_addon_product (addon_rule_id, product_id)
          SELECT $1, unnest($2::int[])
          RETURNING addon_rule_id, product_id;
      `;

      return dbQuery(query, [addonRuleId, productIds], schemas.relations.addonProducts.array, 'multiple', executor);
    },

    async deleteMany(addonRuleId: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
      const query = `
          DELETE
          FROM addon_rule_addon_product
          WHERE addon_rule_id = $1
      `;

      return dbDelete(query, [addonRuleId], executor, { strict: false });
    },
  },

  targetCategories: {
    async insertMany(
      addonRuleId: number,
      categoryIds: number[],
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<AddonRuleTargetCategoryRelation[]>> {
      const query = `
          INSERT INTO addon_rule_target_category (addon_rule_id, category_id)
          SELECT $1, unnest($2::int[])
          RETURNING addon_rule_id, category_id;
      `;

      return dbQuery(query, [addonRuleId, categoryIds], schemas.relations.targetCategories.array, 'multiple', executor);
    },

    async deleteMany(addonRuleId: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
      const query = `
          DELETE
          FROM addon_rule_target_category
          WHERE addon_rule_id = $1
      `;

      return dbDelete(query, [addonRuleId], executor, { strict: false });
    },
  },

  targetProducts: {
    async insertMany(
      addonRuleId: number,
      productIds: number[],
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<AddonRuleTargetProductRelation[]>> {
      const query = `
          INSERT INTO addon_rule_target_product (addon_rule_id, product_id)
          SELECT $1, unnest($2::int[])
          RETURNING addon_rule_id, product_id;
      `;

      return dbQuery(query, [addonRuleId, productIds], schemas.relations.targetProducts.array, 'multiple', executor);
    },

    async deleteMany(addonRuleId: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
      const query = `
          DELETE
          FROM addon_rule_target_product
          WHERE addon_rule_id = $1
      `;

      return dbDelete(query, [addonRuleId], executor, { strict: false });
    },
  },
};
