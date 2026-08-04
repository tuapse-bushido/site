import { z } from 'zod';
import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ActionResult } from 'shared/types/action.types';
import { dbDelete, dbQuery } from 'shared/utils/db.utils';
import {
  InsertProduct,
  Product,
  productSchemas as schemas,
  ProductWithDetails,
} from 'modules/admin/menu/products/entities/product.entity';

export const productRepo = {
  async getAllProducts(): Promise<ActionResult<Product[]>> {
    'use cache';
    cacheLife('admin');
    cacheTag('products', 'products-all');

    const query = `
      SELECT id,
             title,
             is_active,
             is_visible,
             slug,
             image_link,
             price,
             weight,
             count_portion,
             quantity,
             is_set
      FROM product
      ORDER BY id;
  `;

    return dbQuery(query, [], schemas.array, 'multiple');
  },

  async getProductWithDetails(id: number): Promise<ActionResult<ProductWithDetails>> {
    'use cache';
    cacheLife('admin');
    cacheTag('products', `product-details-${id}`);

    const query = `
      SELECT
        p.id,
        p.title,
        p.is_active,
        p.is_visible,
        p.slug,
        p.image_link,
        p.price,
        p.weight,
        p.count_portion,
        p.quantity,
        p.is_set,

        COALESCE(si.set_items, '[]'::jsonb) AS set_items,
        COALESCE(ing.ingredients, '[]'::jsonb) AS ingredients,
        COALESCE(cat.categories, '[]'::jsonb) AS categories

      FROM product p

      LEFT JOIN LATERAL (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', sp.id,
            'title', sp.title
          )
          ORDER BY sp.id
        ) AS set_items
        FROM set_item si
        JOIN product sp ON sp.id = si.product_id
        WHERE si.set_product_id = p.id
      ) si ON true

      LEFT JOIN LATERAL (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', i.id,
            'title', i.title
          )
          ORDER BY i.id
        ) AS ingredients
        FROM product_ingredient pi
        JOIN ingredient i ON i.id = pi.ingredient_id
        WHERE pi.product_id = p.id
      ) ing ON true

      LEFT JOIN LATERAL (
        SELECT jsonb_agg(
          jsonb_build_object(
            'id', c.id,
            'title', c.title
          )
          ORDER BY c.id
        ) AS categories
        FROM product_category pc
        JOIN category c ON c.id = pc.category_id
        WHERE pc.product_id = p.id
      ) cat ON true

      WHERE p.id = $1;
    `;

    return dbQuery(query, [id], schemas.details);
  },

  async insertProduct(
    product: InsertProduct,
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<Product>> {
    const { title, is_active, is_visible, image_link, is_set, count_portion, price, slug, weight, quantity } = product;

    const query = `
      INSERT INTO product (
        title,
        is_active,
        is_visible,
        slug,
        image_link,
        price,
        weight,
        count_portion,
        quantity,
        is_set
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
      `;

    const params = [title, is_active, is_visible, slug, image_link, price, weight, count_portion, quantity, is_set];

    return dbQuery(query, params, schemas.base, 'single', executor);
  },

  async updateProduct(product: Product, executor: PoolClient | typeof pool = pool): Promise<ActionResult<Product>> {
    const { id, title, is_active, is_visible, image_link, is_set, count_portion, price, slug, weight, quantity } =
      product;

    const query = `
        UPDATE product
        SET title         = $2,
            is_active     = $3,
            is_visible    = $4,
            slug          = $5,
            image_link    = $6,
            price         = $7,
            weight        = $8,
            count_portion = $9,
            quantity      = $10,
            is_set        = $11
        WHERE id = $1
        RETURNING *
      `;

    const params = [id, title, is_active, is_visible, slug, image_link, price, weight, count_portion, quantity, is_set];
    return dbQuery(query, params, schemas.base, 'single', executor);
  },

  async deleteProduct(id: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
    const query = `
        DELETE
        FROM product
        WHERE id = $1;
    `;

    return dbDelete(query, [id], executor);
  },

  async getCount(): Promise<ActionResult<{ count: number }>> {
    const query = `
        SELECT count(*) AS count
        FROM product
        ;
    `;

    return dbQuery(query, [], z.object({ count: z.coerce.number() }));
  },
};
