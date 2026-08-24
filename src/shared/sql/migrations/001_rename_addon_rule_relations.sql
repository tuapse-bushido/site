BEGIN;

-- A composite primary key cannot be added while duplicate relations exist.
DELETE FROM addon AS current_relation
USING addon AS duplicate_relation
WHERE current_relation.addon_rule_id = duplicate_relation.addon_rule_id
  AND current_relation.product_id = duplicate_relation.product_id
  AND current_relation.id > duplicate_relation.id;

ALTER TABLE addon RENAME TO addon_rule_addon_product;
ALTER TABLE addon_rule_to_category RENAME TO addon_rule_target_category;
ALTER TABLE addon_rule_to_product RENAME TO addon_rule_target_product;

ALTER TABLE addon_rule_addon_product
  DROP CONSTRAINT addon_pkey,
  DROP COLUMN id,
  ADD CONSTRAINT addon_rule_addon_product_pkey PRIMARY KEY (addon_rule_id, product_id);

DROP SEQUENCE IF EXISTS addon_id_seq;

ALTER TABLE addon_rule_addon_product
  RENAME CONSTRAINT addon_addon_rule_id_fkey TO addon_rule_addon_product_rule_id_fkey;
ALTER TABLE addon_rule_addon_product
  RENAME CONSTRAINT addon_product_id_fkey TO addon_rule_addon_product_product_id_fkey;
ALTER TABLE addon_rule_addon_product
  RENAME CONSTRAINT addon_addon_rule_id_not_null TO addon_rule_addon_product_addon_rule_id_not_null;
ALTER TABLE addon_rule_addon_product
  RENAME CONSTRAINT addon_product_id_not_null TO addon_rule_addon_product_product_id_not_null;

ALTER TABLE addon_rule_target_category
  RENAME CONSTRAINT addon_to_category_pkey TO addon_rule_target_category_pkey;
ALTER TABLE addon_rule_target_category
  RENAME CONSTRAINT addon_rule_to_category_rule_id_fkey TO addon_rule_target_category_rule_id_fkey;
ALTER TABLE addon_rule_target_category
  RENAME CONSTRAINT addon_to_category_category_id_fkey TO addon_rule_target_category_category_id_fkey;
ALTER TABLE addon_rule_target_category
  RENAME CONSTRAINT addon_rule_to_category_addon_rule_id_not_null TO addon_rule_target_category_addon_rule_id_not_null;
ALTER TABLE addon_rule_target_category
  RENAME CONSTRAINT addon_rule_to_category_category_id_not_null TO addon_rule_target_category_category_id_not_null;

ALTER TABLE addon_rule_target_product
  RENAME CONSTRAINT addon_to_product_pkey TO addon_rule_target_product_pkey;
ALTER TABLE addon_rule_target_product
  RENAME CONSTRAINT addon_rule_to_product_rule_id_fkey TO addon_rule_target_product_rule_id_fkey;
ALTER TABLE addon_rule_target_product
  RENAME CONSTRAINT addon_to_product_product_id_fkey TO addon_rule_target_product_product_id_fkey;
ALTER TABLE addon_rule_target_product
  RENAME CONSTRAINT addon_rule_to_product_addon_rule_id_not_null TO addon_rule_target_product_addon_rule_id_not_null;
ALTER TABLE addon_rule_target_product
  RENAME CONSTRAINT addon_rule_to_product_product_id_not_null TO addon_rule_target_product_product_id_not_null;

DROP INDEX IF EXISTS idx_addon_addon_rule_id;
DROP INDEX IF EXISTS idx_addon_rule_to_category_rule_id;
DROP INDEX IF EXISTS idx_addon_rule_to_product_rule_id;

ALTER INDEX IF EXISTS idx_addon_product_id
  RENAME TO idx_addon_rule_addon_product_product_id;
ALTER INDEX IF EXISTS idx_addon_rule_to_category_category_id
  RENAME TO idx_addon_rule_target_category_category_id;
ALTER INDEX IF EXISTS idx_addon_rule_to_product_product_id
  RENAME TO idx_addon_rule_target_product_product_id;

COMMIT;
