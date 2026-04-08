import { dbDelete, dbQuery } from 'shared/utils/db.utils';
import { cacheLife, cacheTag } from 'next/cache';
import { ActionResult } from 'shared/types/action.types';
import {
  Addon,
  AddonRule,
  AddonRuleDetail,
  addonRuleDetailSchema,
  addonRuleSchema,
  arrayAddonRuleDetailSchema,
  arrayAddonsSchema,
  arrayRuleToCategorySchema,
  arrayRuleToProductSchema,
  InsertAddonRule,
  RuleToCategory,
  RuleToProduct,
} from '../entities';
import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';

export const addonRuleRepo = {
  rule: {
    async getAddonRules(executor: PoolClient | typeof pool = pool): Promise<ActionResult<AddonRuleDetail[]>> {
      'use cache';
      cacheLife('admin');
      cacheTag('addon-rules', 'addon-rules-list');

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

               -- Собираем аддоны
               LEFT JOIN LATERAL (
          SELECT jsonb_agg(jsonb_build_object('id', prod.id, 'title', prod.title)) AS list
          FROM addon ad
                   JOIN product prod ON prod.id = ad.product_id
          WHERE ad.addon_rule_id = ar.id -- Мы видим ar.id из внешней таблицы!
          ) a ON true

          -- Собираем категории
               LEFT JOIN LATERAL (
          SELECT jsonb_agg(jsonb_build_object('id', cat.id, 'title', cat.title)) AS list
          FROM addon_rule_to_category arc
                   JOIN category cat ON cat.id = arc.category_id
          WHERE arc.addon_rule_id = ar.id
          ) c ON true

          -- Собираем товары
               LEFT JOIN LATERAL (
          SELECT jsonb_agg(jsonb_build_object('id', prod.id, 'title', prod.title)) AS list
          FROM addon_rule_to_product arp
                   JOIN product prod ON prod.id = arp.product_id
          WHERE arp.addon_rule_id = ar.id
          ) p ON true

      ORDER BY ar.id;
  `;

      return dbQuery(query, [], arrayAddonRuleDetailSchema, 'multiple', executor);
    },

    async getAddonRuleById(
      id: number,
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<AddonRuleDetail>> {
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

               -- Собираем аддоны
               LEFT JOIN LATERAL (
          SELECT jsonb_agg(jsonb_build_object('id', prod.id, 'title', prod.title)) AS list
          FROM addon ad
                   JOIN product prod ON prod.id = ad.product_id
          WHERE ad.addon_rule_id = ar.id -- Мы видим ar.id из внешней таблицы!
          ) a ON true

          -- Собираем категории
               LEFT JOIN LATERAL (
          SELECT jsonb_agg(jsonb_build_object('id', cat.id, 'title', cat.title)) AS list
          FROM addon_rule_to_category arc
                   JOIN category cat ON cat.id = arc.category_id
          WHERE arc.addon_rule_id = ar.id
          ) c ON true

          -- Собираем товары
               LEFT JOIN LATERAL (
          SELECT jsonb_agg(jsonb_build_object('id', prod.id, 'title', prod.title)) AS list
          FROM addon_rule_to_product arp
                   JOIN product prod ON prod.id = arp.product_id
          WHERE arp.addon_rule_id = ar.id
          ) p ON true

      WHERE ar.id = $1;
  `;

      return dbQuery(query, [id], addonRuleDetailSchema, 'single', executor);
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

      return dbQuery(query, params, addonRuleSchema, 'single', executor);
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

      return dbQuery(query, params, addonRuleSchema, 'single', executor);
    },

    async deleteAddonRule(id: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
      const query = `
      DELETE FROM addon_rule WHERE id = $1;
      `;

      return dbDelete(query, [id], executor);
    },
  },
  addons: {
    async insertAddonMany(
      ruleId: number,
      addonsId: number[],
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<Addon[]>> {
      const query = `
      INSERT INTO addon (addon_rule_id, product_id)
      SELECT $1, unnest($2::int[])
      RETURNING *;
  `;

      return dbQuery(query, [ruleId, addonsId], arrayAddonsSchema, 'multiple', executor);
    },

    async deleteAddonMany(ruleId: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
      const query = `
      DELETE
      FROM addon
      WHERE addon_rule_id = $1;
  `;

      return dbDelete(query, [ruleId], executor, { strict: false });
    },
  },
  categories: {
    async insertRuleToCategoryMany(
      ruleId: number,
      categoriesId: number[],
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<RuleToCategory[]>> {
      const query = `
      INSERT INTO addon_rule_to_category (addon_rule_id, category_id)
      SELECT $1, unnest($2::int[])
      RETURNING *;
  `;

      return dbQuery(query, [ruleId, categoriesId], arrayRuleToCategorySchema, 'multiple', executor);
    },

    async deleteRuleToCategoryMany(
      ruleId: number,
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<null>> {
      const query = `
      DELETE
      FROM addon_rule_to_category
      WHERE addon_rule_id = $1;
  `;

      return dbDelete(query, [ruleId], executor, { strict: false });
    },
  },
  products: {
    async insertRuleToProductMany(
      ruleId: number,
      productsId: number[],
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<RuleToProduct[]>> {
      const query = `
      INSERT INTO addon_rule_to_product (addon_rule_id, product_id)
      SELECT $1, unnest($2::int[])
      RETURNING *;
  `;

      return dbQuery(query, [ruleId, productsId], arrayRuleToProductSchema, 'multiple', executor);
    },

    async deleteRuleToProductMany(
      ruleId: number,
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<null>> {
      const query = `
      DELETE
      FROM addon_rule_to_product
      WHERE addon_rule_id = $1;
  `;

      return dbDelete(query, [ruleId], executor, { strict: false });
    },
  },
};
