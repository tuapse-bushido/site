'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { ActionResult } from 'shared/types/action.types';
import { dbExecute, dbQuery } from 'shared/utils/db.utils';
import { Ingredient, ingredientArraySchema, ingredientSchema } from 'modules/admin/menu/ingredients';
import { z } from 'zod';

export const getIngredientById = async (id: number): Promise<ActionResult<Ingredient>> => {
  'use cache';
  cacheLife('admin');
  cacheTag(`ingredient-${id}`);

  const query = `
    SELECT id, title
    FROM ingredient
    WHERE id = $1;
  `;
  const params = [id];

  return dbQuery(query, params, ingredientSchema);
};

export const getAllIngredients = async (): Promise<ActionResult<Ingredient[]>> => {
  'use cache';
  cacheLife('admin');
  cacheTag(`ingredients`);

  const query = `
    SELECT id, title
    FROM ingredient
    ORDER BY id;
  `;

  return dbQuery(query, [], ingredientArraySchema, 'multiple');
};

export const insertIngredient = async (title: string): Promise<ActionResult<Ingredient>> => {
  const query = `
    INSERT INTO ingredient (title)
    VALUES ($1)
    RETURNING id, title;
  `;
  const params = [title];

  return dbExecute(query, params);
};

export const updateIngredientById = async (ingredient: Ingredient): Promise<ActionResult<Ingredient>> => {
  const query = `
    UPDATE ingredient
    SET title = $1
    WHERE id = $2
    RETURNING id, title;
  `;
  const params = [ingredient.title, ingredient.id];

  return dbExecute(query, params);
};

export const getCount = async (): Promise<ActionResult<{ count: number }>> => {
  const query = `
        SELECT count(*) AS count
        FROM ingredient
        ;
    `;

  return dbQuery(query, [], z.object({ count: z.coerce.number() }));
};
