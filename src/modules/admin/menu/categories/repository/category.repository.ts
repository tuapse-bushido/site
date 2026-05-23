import { z } from 'zod';
import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { dbDelete, dbQuery } from 'shared/utils/db.utils';
import { cacheLife, cacheTag } from 'next/cache';
import { ActionResult } from 'shared/types/action.types';
import { Category, categorySchemas as schemas, InsertCategory } from 'modules/admin/menu/categories/entities';

export const categoryRepo = {
  async getCategoryById(id: number): Promise<ActionResult<Category>> {
    'use cache';
    cacheLife('admin');
    cacheTag('categories', `category-${id}`);

    const query = `
      SELECT id, title, is_active, slug, image_link, sort_number
      FROM category
      WHERE id = $1;
  `;

    return dbQuery(query, [id], schemas.base);
  },

  async getAllCategories(): Promise<ActionResult<Category[]>> {
    'use cache';
    cacheLife('admin');
    cacheTag('categories', 'categories-all');

    const query = `
      SELECT id, title, is_active, slug, image_link, sort_number
      FROM category
      ORDER BY id;
  `;

    return dbQuery(query, [], schemas.arraySchema, 'multiple');
  },

  async insertCategory(
    category: InsertCategory,
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<Category>> {
    const query = `
      INSERT INTO category (title, is_active, slug, image_link, sort_number)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, is_active, slug, image_link, sort_number;`;

    const params = [category.title, category.is_active, category.slug, category.image_link, category.sort_number];

    return dbQuery(query, params, schemas.base, 'single', executor);
  },

  async updateCategory(category: Category, executor: PoolClient | typeof pool = pool): Promise<ActionResult<Category>> {
    const query = `
      UPDATE category
      SET (title, is_active, slug, image_link, sort_number) = ($2, $3, $4, $5, $6)
      WHERE id = $1
      RETURNING id, title, is_active, slug, image_link, sort_number;
  `;

    const params = [
      category.id,
      category.title,
      category.is_active,
      category.slug,
      category.image_link,
      category.sort_number,
    ];

    return dbQuery(query, params, schemas.base, 'single', executor);
  },

  async categoryDelete(id: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
    const query = `
        DELETE
        FROM category
        WHERE id = $1;
    `;

    return dbDelete(query, [id], executor);
  },

  async getCount(): Promise<ActionResult<{ count: number }>> {
    'use cache';
    cacheLife('admin');
    cacheTag(`categories`, 'categories-count');

    const query = `
        SELECT count(*) AS count
        FROM category
        ;
    `;

    return dbQuery(query, [], z.object({ count: z.coerce.number() }));
  },
};
