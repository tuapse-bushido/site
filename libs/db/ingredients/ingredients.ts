import { pool } from '@/libs/db/db';
import { Ingredient, ingredientArraySchema, ingredientSchema } from '@/types/db/tables/ingredient';

import { DatabaseError } from 'pg';
import { ActionResult, actionResult, ErrorCode, errorResult } from '@/utils';

/**
 * Fetches all ingredients from the database.
 *
 * ---
 * Получает все ингредиенты из базы данных.
 *
 * @returns {Promise<ActionResult<Ingredient[]>>} Result with an array of ingredients or an error.
 *
 * @example
 * const result = await getAllIngredients();
 * if (result.success) console.log(result.data);
 */
export const getAllIngredients = async (): Promise<ActionResult<Ingredient[]>> => {
  try {
    const response = await pool.query(
      `SELECT id, title
       FROM ingredient
      `,
    );

    const result = ingredientArraySchema.safeParse(response.rows);
    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<Ingredient[]>(result.data);
  } catch (error) {
    console.error('❌ DB error in getAllIngredients:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Fetches a single ingredient by its ID.
 *
 * ---
 * Получает один ингредиент по его ID.
 *
 * @param {string} id - The ID of the ingredient / Идентификатор ингредиента
 * @returns {Promise<ActionResult<Ingredient>>} Ingredient data or error.
 *
 * @example
 * const result = await getIngredientById('3');
 */
export const getIngredientById = async (id: string): Promise<ActionResult<Ingredient>> => {
  try {
    const response = await pool.query(
      `SELECT id, title
       FROM ingredient
       WHERE id = $1`,
      [id],
    );

    if (response.rowCount === 0) {
      return errorResult(ErrorCode.NOT_FOUND);
    }

    const row = response.rows[0];

    const result = ingredientSchema.safeParse(row);
    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult(result.data);
  } catch (error) {
    console.error('❌ DB error in getIngredientById:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Inserts a new ingredient into the database.
 *
 * ---
 * Вставляет новый ингредиент в базу данных.
 *
 * @param {string} title - Title of the ingredient / Название ингредиента
 * @returns {Promise<ActionResult<Ingredient>>} Created ingredient or error.
 *
 * @example
 * const result = await insertIngredient('Креветка');
 */
export const insertIngredient = async (title: string): Promise<ActionResult<Ingredient>> => {
  try {
    const response = await pool.query(
      `INSERT INTO ingredient (title)
       VALUES ($1)
       RETURNING id, title`,
      [title],
    );

    const result = ingredientSchema.safeParse(response.rows[0]);

    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<Ingredient>(result.data);
  } catch (error) {
    console.error('❌ DB insert error in insertIngredient:', error);

    if (error instanceof DatabaseError && error.code === '23505') {
      // duplicate key
      return errorResult(ErrorCode.DUPLICATE);
    }

    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Updates an existing ingredient by its ID.
 *
 * ---
 * Обновляет существующий ингредиент по его ID.
 *
 * @param {number} id - ID of the ingredient / Идентификатор ингредиента
 * @param {string} title - New title / Новое название
 * @returns {Promise<ActionResult<Ingredient>>} Updated ingredient or error.
 *
 * @example
 * const result = await updateIngredient(5, 'Лосось');
 */
export const updateIngredient = async (id: number, title: string): Promise<ActionResult<Ingredient>> => {
  try {
    const response = await pool.query(
      `UPDATE ingredient
       SET title = $1
       WHERE id = $2
       RETURNING id, title`,
      [title, id],
    );

    const result = ingredientSchema.safeParse(response.rows[0]);

    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<Ingredient>(result.data);
  } catch (error) {
    console.error('❌ DB error in updateIngredient:', error);

    if (error instanceof DatabaseError && error.code === '23505') {
      return errorResult(ErrorCode.DUPLICATE);
    }

    return errorResult(ErrorCode.DB_ERROR);
  }
};
