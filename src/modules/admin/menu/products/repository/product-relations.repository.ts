import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { ActionResult } from 'shared/types/action.types';
import { dbDelete, dbQuery } from 'shared/utils/db.utils';
import {
  ProductSetItemRelation,
  ProductCategoryRelation,
  ProductIngredientRelation,
  productSchemas as schemas,
} from 'modules/admin/menu/products/entities';

export const productRelationsRepo = {
  ingredients: {
    async insertMany(
      productId: number,
      ids: number[],
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<ProductIngredientRelation[]>> {
      const query = `
          INSERT INTO product_ingredient (
              product_id,
              ingredient_id
          )
          SELECT $1, unnest($2::int[])
          RETURNING product_id, ingredient_id;
      `;

      return dbQuery(query, [productId, ids], schemas.relations.ingredients.array, 'multiple', executor);
    },

    async deleteMany(productId: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
      const query = `
          DELETE
          FROM product_ingredient
          WHERE product_id = $1
      `;

      return dbDelete(query, [productId], executor, { strict: false });
    },
  },
  categories: {
    async insertMany(
      productId: number,
      ids: number[],
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<ProductCategoryRelation[]>> {
      const query = `
          INSERT INTO product_category (
              product_id,
              category_id
          )
          SELECT $1, unnest($2::int[])
          RETURNING product_id, category_id;
      `;

      return dbQuery(query, [productId, ids], schemas.relations.categories.array, 'multiple', executor);
    },

    async deleteMany(productId: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
      const query = `
          DELETE
          FROM product_category
          WHERE product_id = $1
      `;

      return dbDelete(query, [productId], executor, { strict: false });
    },
  },
  setItems: {
    async insertMany(
      setProductId: number,
      ids: number[],
      executor: PoolClient | typeof pool = pool,
    ): Promise<ActionResult<ProductSetItemRelation[]>> {
      const query = `
          INSERT INTO set_item (
              set_product_id,
              product_id
          )
          SELECT $1, unnest($2::int[])
          RETURNING set_product_id, product_id;
      `;

      return dbQuery(query, [setProductId, ids], schemas.relations.set_items.array, 'multiple', executor);
    },

    async deleteMany(setProductId: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
      const query = `
          DELETE
          FROM set_item
          WHERE set_item.set_product_id = $1
      `;

      return dbDelete(query, [setProductId], executor, { strict: false });
    },
  },
};
