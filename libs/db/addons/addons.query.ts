'use server';
import { pool } from '@/libs/db/db';
import {
  addonArraySchema,
  AddonRule,
  AddonRuleFull,
  addonRuleFullArraySchema,
  addonRuleFullSchema,
  addonRuleSchema,
  addonRuleToCategoryArraySchema,
  addonRuleToProductArraySchema,
} from '@/types';
import { ActionResult, actionResult, ErrorCode, errorResult } from '@/utils';
import { RuleCreate, RuleUpdate } from '@/types/actions/form-schemas';

const queries = {
  insertAddonRule: `
    INSERT INTO addon_rule (title, base_count, divisor, show_count_percent, is_active)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, base_count, divisor, show_count_percent, is_active;
  `,
  insertAddons: `
    INSERT INTO addon (addon_rule_id, product_id)
    SELECT $1, unnest($2::int[])
    RETURNING id, addon_rule_id, product_id;
  `,
  insertRuleToProduct: `
    INSERT INTO addon_rule_to_product (addon_rule_id, product_id)
    SELECT $1, unnest($2::int[])
    RETURNING *;
  `,
  insertRuleToCategory: `
    INSERT INTO addon_rule_to_category (addon_rule_id, category_id)
    SELECT $1, unnest($2::int[])
    RETURNING *;
  `,
  updateAddonRule: `
    UPDATE addon_rule
    SET title              = $2,
        base_count         = $3,
        divisor            = $4,
        show_count_percent = $5,
        is_active          = $6
    WHERE id = $1
    RETURNING id, title, base_count, divisor, show_count_percent, is_active;
  `,
  deleteAddonRule: `
    DELETE
    FROM addon_rule
    WHERE id = $1
    RETURNING id, title, base_count, divisor, show_count_percent, is_active;`,
  deleteAddons: `
    DELETE
    FROM addon
    WHERE addon_rule_id = $1;
  `,
  deleteRuleToProduct: `
    DELETE
    FROM addon_rule_to_product
    WHERE addon_rule_id = $1;
  `,
  deleteRuleToCategory: `
    DELETE
    FROM addon_rule_to_category
    WHERE addon_rule_id = $1;
  `,
};

export const getAllAddonRuleFull = async (): Promise<ActionResult<AddonRuleFull[]>> => {
  try {
    const query = `
      SELECT adr.id,
             adr.title,
             adr.base_count,
             adr.divisor,
             adr.show_count_percent,
             adr.is_active,

             -- Продукты-добавки (в рамках правила)
             COALESCE((SELECT json_agg(json_build_object(
               'addon_product_id', p.id,
               'addon_product_title', p.title
                                       ))
                       FROM addon a
                              JOIN product p ON p.id = a.product_id
                       WHERE a.addon_rule_id = adr.id), '[]')  AS addon_products,

             -- Продукты, к которым применяется правило
             COALESCE((SELECT json_agg(json_build_object(
               'product_id', p.id,
               'product_title', p.title
                                       ))
                       FROM addon_rule_to_product ap
                              JOIN product p ON p.id = ap.product_id
                       WHERE ap.addon_rule_id = adr.id), '[]') AS attached_products,

             -- Категории, к которым применяется правило
             COALESCE((SELECT json_agg(json_build_object(
               'category_id', c.id,
               'category_title', c.title
                                       ))
                       FROM addon_rule_to_category ac
                              JOIN category c ON c.id = ac.category_id
                       WHERE ac.addon_rule_id = adr.id), '[]') AS attached_categories

      FROM addon_rule adr;
    `;

    const response = await pool.query(query);
    const result = addonRuleFullArraySchema.safeParse(response.rows);

    if (!result.success) return errorResult(ErrorCode.VALIDATION_FAILED);

    return actionResult(result.data);
  } catch (error) {
    console.error('❌ DB error in getAllAddonRules:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};

export const getAddonRuleFullById = async (id: number): Promise<ActionResult<AddonRuleFull>> => {
  const query = `
    SELECT adr.id,
           adr.title,
           adr.base_count,
           adr.divisor,
           adr.show_count_percent,
           adr.is_active,

           -- Продукты-добавки (в рамках правила)
           COALESCE((SELECT json_agg(json_build_object(
             'addon_product_id', p.id,
             'addon_product_title', p.title
                                     ))
                     FROM addon a
                            JOIN product p ON p.id = a.product_id
                     WHERE a.addon_rule_id = adr.id), '[]')  AS addon_products,

           -- Продукты, к которым применяется правило
           COALESCE((SELECT json_agg(json_build_object(
             'product_id', p.id,
             'product_title', p.title
                                     ))
                     FROM addon_rule_to_product ap
                            JOIN product p ON p.id = ap.product_id
                     WHERE ap.addon_rule_id = adr.id), '[]') AS attached_products,

           -- Категории, к которым применяется правило
           COALESCE((SELECT json_agg(json_build_object(
             'category_id', c.id,
             'category_title', c.title
                                     ))
                     FROM addon_rule_to_category ac
                            JOIN category c ON c.id = ac.category_id
                     WHERE ac.addon_rule_id = adr.id), '[]') AS attached_categories

    FROM addon_rule adr
    WHERE adr.id = $1;
  `;

  try {
    const response = await pool.query(query, [id]);
    const result = addonRuleFullSchema.safeParse(response.rows[0]);

    if (!result.success) return errorResult(ErrorCode.VALIDATION_FAILED);

    return actionResult(result.data);
  } catch (error) {
    console.error('❌ DB error in getAddonRuleById:', error);
    return errorResult(ErrorCode.DB_ERROR);
  }
};

export const insertFullRule = async (rule: RuleCreate): Promise<ActionResult<AddonRule>> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const addonRuleResponse = await client.query(queries.insertAddonRule, [
      rule.title,
      rule.base_count,
      rule.divisor,
      rule.show_count_percent,
      rule.is_active,
    ]);
    const addonRule = addonRuleSchema.safeParse(addonRuleResponse.rows[0]);
    if (!addonRule.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    const { id: addon_rule_id } = addonRule.data;

    const addonResponse = await client.query(queries.insertAddons, [addon_rule_id, rule.addon_products]);
    const addons = addonArraySchema.safeParse(addonResponse.rows);
    if (!addons.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    const ruleToProductResponse = await client.query(queries.insertRuleToProduct, [addon_rule_id, rule.products]);
    const ruleToProduct = addonRuleToProductArraySchema.safeParse(ruleToProductResponse.rows);
    if (!ruleToProduct.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    const ruleToCategoryResponse = await client.query(queries.insertRuleToCategory, [addon_rule_id, rule.categories]);
    const ruleToCategory = addonRuleToCategoryArraySchema.safeParse(ruleToCategoryResponse.rows);
    if (!ruleToCategory.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    await client.query('COMMIT');
    return actionResult(addonRule.data);
  } catch (error) {
    console.error('❌ DB error in createFullRule:', error);
    await client.query('ROLLBACK');
    return errorResult(ErrorCode.DB_ERROR);
  } finally {
    client.release();
  }
};

export const updateFullRule = async (rule: RuleUpdate): Promise<ActionResult<AddonRule>> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const { id: addon_rule_id } = rule;

    const addonRuleResponse = await client.query(queries.updateAddonRule, [
      addon_rule_id,
      rule.title,
      rule.base_count,
      rule.divisor,
      rule.show_count_percent,
      rule.is_active,
    ]);
    const addonRule = addonRuleSchema.safeParse(addonRuleResponse.rows[0]);
    if (!addonRule.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    await client.query(queries.deleteAddons, [addon_rule_id]);
    const addonResponse = await client.query(queries.insertAddons, [addon_rule_id, rule.addon_products]);
    const addons = addonArraySchema.safeParse(addonResponse.rows);
    if (!addons.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    await client.query(queries.deleteRuleToProduct, [addon_rule_id]);
    const ruleToProductResponse = await client.query(queries.insertRuleToProduct, [addon_rule_id, rule.products]);
    const ruleToProduct = addonRuleToProductArraySchema.safeParse(ruleToProductResponse.rows);
    if (!ruleToProduct.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    await client.query(queries.deleteRuleToCategory, [addon_rule_id]);
    const ruleToCategoryResponse = await client.query(queries.insertRuleToCategory, [addon_rule_id, rule.categories]);
    const ruleToCategory = addonRuleToCategoryArraySchema.safeParse(ruleToCategoryResponse.rows);
    if (!ruleToCategory.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    await client.query('COMMIT');
    return actionResult(addonRule.data);
  } catch (error) {
    console.error('❌ DB error in updateFullRule:', error);
    await client.query('ROLLBACK');
    return errorResult(ErrorCode.DB_ERROR);
  } finally {
    client.release();
  }
};

export const deleteAddonRuleById = async (id: number): Promise<ActionResult<AddonRule>> => {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    await client.query(queries.deleteAddons, [id]);
    await client.query(queries.deleteRuleToProduct, [id]);
    await client.query(queries.deleteRuleToCategory, [id]);

    const response = await client.query(queries.deleteAddonRule, [id]);
    if (!response.rows[0]) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.NOT_FOUND);
    }

    const rule = addonRuleSchema.safeParse(response.rows[0]);

    if (!rule.success) {
      await client.query('ROLLBACK');
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    await client.query('COMMIT');
    return actionResult(rule.data);
  } catch (error) {
    console.error('❌ DB error in deleteAddonRuleById:', error);
    await client.query('ROLLBACK');
    return errorResult(ErrorCode.DB_ERROR);
  } finally {
    client.release();
  }
};
