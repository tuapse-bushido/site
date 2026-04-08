'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { dbQuery } from 'shared/utils/db.utils';
import { Product, productArraySchema } from 'modules/admin/menu/products/entities/product.entity';
import { ActionResult } from 'shared/types/action.types';
import { pool } from 'shared/configs/db';
import {
  CreateProductForm,
  ProductForm,
} from 'modules/admin/menu/products/features/product-form/model/product-form.schema';
import { actionError, actionSuccess } from 'modules/admin/shared/utils/action.utils';
import { ErrorCode } from 'shared/types/error-codes.types';
import { z } from 'zod';

/**
 * Fetches all products from the database.
 *
 * ---
 * Получает список всех товаров из базы данных.
 *
 * @returns {Promise<ActionResult<Product[]>>} Массив товаров или ошибка.
 *
 * @example
 * const result = await getAllProducts();
 * if (result.success) console.log(result.data);
 */
export const getAllProducts = async (): Promise<ActionResult<Product[]>> => {
  'use cache';
  cacheLife('admin');
  cacheTag(`products`);

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

  return dbQuery(query, [], productArraySchema, 'multiple');
};

export const insertProduct = async (product: CreateProductForm): Promise<ActionResult<Product>> => {
  const client = await pool.connect();

  const {
    title,
    is_active,
    is_visible,
    image_link,
    is_set,
    count_portion,
    price,
    slug,
    weight,
    quantity,
    ingredients,
    categories,
    set_items,
  } = product;

  try {
    await client.query('BEGIN');

    // INSERT PRODUCT
    const resultProduct = await client.query(
      `
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
      `,
      [title, is_active, is_visible, slug, image_link, price, weight, count_portion, quantity, is_set],
    );

    const product = resultProduct.rows[0];
    const productId = product?.id;
    if (!productId) {
      await client.query('ROLLBACK');
      return actionError(ErrorCode.DB_ERROR, {
        details: 'Product insert failed',
      });
    }

    // INSERT INGREDIENTS
    if (ingredients !== null) {
      await client.query(
        `
        INSERT INTO product_ingredient (product_id, ingredient_id)
        SELECT $1, unnest($2::int[])
        `,
        [productId, ingredients],
      );
    }

    // INSERT CATEGORIES
    if (categories !== null) {
      await client.query(
        `
        INSERT INTO product_category (product_id, category_id)
        SELECT $1, unnest($2::int[])
        `,
        [productId, categories],
      );
    }

    // INSERT SET ITEMS
    if (is_set && set_items !== null) {
      await client.query(
        `
        INSERT INTO set_item (set_product_id, product_id)
        SELECT $1, unnest($2::int[])
        `,
        [productId, set_items],
      );
    }

    await client.query('COMMIT');

    return actionSuccess(product);
  } catch (err) {
    await client.query('ROLLBACK');
    return actionError(ErrorCode.DB_ERROR, { details: err });
  } finally {
    client.release();
  }
};

export const updateProduct = async (product: ProductForm): Promise<ActionResult<Product>> => {
  const client = await pool.connect();

  const {
    id,
    title,
    is_active,
    is_visible,
    image_link,
    is_set,
    count_portion,
    price,
    slug,
    weight,
    quantity,
    ingredients,
    categories,
    set_items,
  } = product;

  try {
    await client.query('BEGIN');

    // UPDATE PRODUCT
    const resultProduct = await client.query<Product>(
      `
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
      `,
      [id, title, is_active, is_visible, slug, image_link, price, weight, count_portion, quantity, is_set],
    );

    const updatedProduct = resultProduct.rows[0];

    if (!updatedProduct) {
      await client.query('ROLLBACK');
      return actionError(ErrorCode.NOT_FOUND);
    }

    // UPDATE INGREDIENTS
    await client.query(`DELETE FROM product_ingredient WHERE product_id = $1`, [id]);

    if (ingredients !== null) {
      await client.query(
        `
          INSERT INTO product_ingredient (product_id, ingredient_id)
          SELECT $1, unnest($2::int[])
        `,
        [id, ingredients],
      );
    }

    // UPDATE CATEGORIES
    await client.query(`DELETE FROM product_category WHERE product_id = $1`, [id]);

    if (categories !== null) {
      await client.query(
        `
          INSERT INTO product_category (product_id, category_id)
          SELECT $1, unnest($2::int[])
        `,
        [id, categories],
      );
    }

    // UPDATE SET ITEMS
    await client.query(`DELETE FROM set_item WHERE set_product_id = $1`, [id]);

    // добавляем ТОЛЬКО если это сет и состав задан
    if (is_set && set_items !== null) {
      await client.query(
        `
          INSERT INTO set_item (set_product_id, product_id)
          SELECT $1, unnest($2::int[])
        `,
        [id, set_items],
      );
    }

    await client.query('COMMIT');

    return actionSuccess(updatedProduct);
  } catch (err) {
    await client.query('ROLLBACK');
    return actionError(ErrorCode.DB_ERROR, { details: err });
  } finally {
    client.release();
  }
};

export const getCount = async (): Promise<ActionResult<{ count: number }>> => {
  const query = `
        SELECT count(*) AS count
        FROM product
        ;
    `;

  return dbQuery(query, [], z.object({ count: z.coerce.number() }));
};
