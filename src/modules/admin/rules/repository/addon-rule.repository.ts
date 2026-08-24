import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ActionResult } from 'shared/types/action.types';
import { dbDelete, dbQuery } from 'shared/utils/db.utils';
import { AddonRule, addonRuleSchemas as schemas, AddonRuleWithDetails, InsertAddonRule } from '../entities';

export const addonRuleRepo = {
  async getAddonRules(executor: PoolClient | typeof pool = pool): Promise<ActionResult<AddonRule[]>> {
    'use cache';
    cacheLife('admin');
    cacheTag('addon-rules', 'addon-rules-all');

    const query = `
        SELECT id, title, base_count, divisor, show_count_percent, is_active
        FROM addon_rule
        ORDER BY id;
    `;

    return dbQuery(query, [], schemas.array, 'multiple', executor);
  },

  async getAddonRuleWithDetails(
    id: number,
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<AddonRuleWithDetails>> {
    'use cache';
    cacheLife('admin');
    cacheTag('addon-rules', `addon-rule-${id}`);

    const query = `
        SELECT ar.id,
               ar.title,
               ar.base_count,
               ar.divisor,
               ar.show_count_percent,
               ar.is_active,
               COALESCE(a.list, '[]'::jsonb) AS addons,
               COALESCE(c.list, '[]'::jsonb) AS categories,
               COALESCE(p.list, '[]'::jsonb) AS products
        FROM addon_rule AS ar

        LEFT JOIN LATERAL (
          SELECT jsonb_agg(jsonb_build_object('id', prod.id, 'title', prod.title)) AS list
          FROM addon_rule_addon_product arap
          JOIN product prod ON prod.id = arap.product_id
          WHERE arap.addon_rule_id = ar.id
        ) a ON true

        LEFT JOIN LATERAL (
          SELECT jsonb_agg(jsonb_build_object('id', cat.id, 'title', cat.title)) AS list
          FROM addon_rule_target_category artc
          JOIN category cat ON cat.id = artc.category_id
          WHERE artc.addon_rule_id = ar.id
        ) c ON true

        LEFT JOIN LATERAL (
          SELECT jsonb_agg(jsonb_build_object('id', prod.id, 'title', prod.title)) AS list
          FROM addon_rule_target_product artp
          JOIN product prod ON prod.id = artp.product_id
          WHERE artp.addon_rule_id = ar.id
        ) p ON true

        WHERE ar.id = $1;
    `;

    return dbQuery(query, [id], schemas.details, 'single', executor);
  },

  async insertAddonRule(
    addonRule: InsertAddonRule,
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<AddonRule>> {
    const query = `
        INSERT INTO addon_rule (title, base_count, divisor, show_count_percent, is_active)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
    `;
    const params = [
      addonRule.title,
      addonRule.base_count,
      addonRule.divisor,
      addonRule.show_count_percent,
      addonRule.is_active,
    ];

    return dbQuery(query, params, schemas.base, 'single', executor);
  },

  async updateAddonRule(
    addonRule: AddonRule,
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<AddonRule>> {
    const query = `
        UPDATE addon_rule
        SET title              = $2,
            base_count         = $3,
            divisor            = $4,
            show_count_percent = $5,
            is_active          = $6
        WHERE id = $1
        RETURNING *;
    `;
    const params = [
      addonRule.id,
      addonRule.title,
      addonRule.base_count,
      addonRule.divisor,
      addonRule.show_count_percent,
      addonRule.is_active,
    ];

    return dbQuery(query, params, schemas.base, 'single', executor);
  },

  async deleteAddonRule(id: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
    const query = `
        DELETE FROM addon_rule
        WHERE id = $1;
    `;

    return dbDelete(query, [id], executor);
  },
};
