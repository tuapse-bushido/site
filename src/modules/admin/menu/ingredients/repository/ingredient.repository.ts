'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { ActionResult } from '@/src/shared/types';
import { ingredientSchema } from '@/types/db/tables/ingredient';
import { dbExecute, dbQuery } from '@/src/shared/utils/dbQuery';
import { Ingredient, ingredientArraySchema } from '@/src/modules/admin/menu/ingredients';

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

export const updateIngredient = async (ingredient: Ingredient): Promise<ActionResult<Ingredient>> => {
  'use cache';
  cacheTag(`ingredient-${ingredient.id}`);

  const query = `
    UPDATE ingredient
    SET title = $1
    WHERE id = $2
    RETURNING id, title;
  `;
  const params = [ingredient.title, ingredient.id];

  return dbExecute(query, params);
};
