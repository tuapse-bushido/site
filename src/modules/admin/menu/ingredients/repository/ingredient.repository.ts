import { z } from 'zod';
import { PoolClient } from 'pg';
import { pool } from 'shared/configs/db';
import { cacheLife, cacheTag } from 'next/cache';
import { ActionResult } from 'shared/types/action.types';
import { dbDelete, dbQuery } from 'shared/utils/db.utils';
import { Ingredient, ingredientSchemas as schemas, InsertIngredient } from 'modules/admin/menu/ingredients/entities';

export const ingredientRepo = {
  async getIngredientById(id: number): Promise<ActionResult<Ingredient>> {
    'use cache';
    cacheLife('admin');
    cacheTag('ingredients', `ingredient-${id}`);

    const query = `
    SELECT id, title
    FROM ingredient
    WHERE id = $1;
  `;
    const params = [id];

    return dbQuery(query, params, schemas.base);
  },

  async getAllIngredients(): Promise<ActionResult<Ingredient[]>> {
    'use cache';
    cacheLife('admin');
    cacheTag(`ingredients`, 'ingredients-all');

    const query = `
    SELECT id, title
    FROM ingredient
    ORDER BY id;
  `;

    return dbQuery(query, [], schemas.array, 'multiple');
  },

  async insertIngredient(
    ingredient: InsertIngredient,
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<Ingredient>> {
    const query = `
    INSERT INTO ingredient (title)
    VALUES ($1)
    RETURNING id, title;
  `;

    const params = [ingredient.title];

    return dbQuery(query, params, schemas.base, 'single', executor);
  },

  async updateIngredient(
    ingredient: Ingredient,
    executor: PoolClient | typeof pool = pool,
  ): Promise<ActionResult<Ingredient>> {
    const query = `
    UPDATE ingredient
    SET title = $1
    WHERE id = $2
    RETURNING id, title;
  `;

    const params = [ingredient.title, ingredient.id];

    return dbQuery(query, params, schemas.base, 'single', executor);
  },

  async getCount(): Promise<ActionResult<{ count: number }>> {
    'use cache';
    cacheLife('admin');
    cacheTag(`ingredients`, 'ingredients-count');

    const query = `
        SELECT count(*) AS count
        FROM ingredient
        ;
    `;

    return dbQuery(query, [], z.object({ count: z.coerce.number() }));
  },

  async deleteIngredient(id: number, executor: PoolClient | typeof pool = pool): Promise<ActionResult<null>> {
    const query = `
    DELETE FROM ingredient WHERE id = $1;
    `;

    return dbDelete(query, [id], executor);
  },
};
