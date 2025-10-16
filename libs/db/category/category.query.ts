'use server';

import { pool } from '@/libs/db/db';
import { ActionResult, actionResult, ErrorCode, errorResult } from '@/utils';
import { Category, categoryArraySchema, categorySchema } from '@/types';
import { DatabaseError } from 'pg';

/**
 * Fetches all categories from the database.
 *
 * ---
 *
 * Получает все категории из базы данных.
 *
 * @return {Promise<ActionResult<Category[]>>} - Result with array of categories or error
 *
 * @example
 * const result = await getAllCategories();
 * if (result.success) {
 *   console.log(result.data); // array of categories
 * }
 */
export const getAllCategories = async (): Promise<ActionResult<Category[]>> => {
  try {
    const response = await pool.query(
      `SELECT id, title, is_active, slug, image_link, sort_number
       FROM category
      `,
    );

    const result = categoryArraySchema.safeParse(response.rows);

    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<Category[]>(result.data);
  } catch (error) {
    console.error('❌ DB error in getAllCategories:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Fetches all **active** product categories from the database.
 *
 * Executes a `SELECT` query on the `category` table where `is_active = true`,
 * excluding timestamp fields, and parses the result using the `categoryArraySchema`
 * to ensure type safety.
 *
 * Note: `created_at` and `updated_at` are not included in the query result.
 *
 * ---
 *
 * Получает все **активные** категории товаров из базы данных.
 *
 * Выполняет `SELECT` запрос по таблице `category` с фильтрацией `is_active = true`
 * (без полей `created_at` и `updated_at`), и валидирует результат через `categoryArraySchema`.
 *
 * Внимание: поля `created_at` и `updated_at` не запрашиваются.
 *
 * @returns Array of `Category` objects / Массив объектов `Category`.
 *
 * @example
 * await getAllActiveCategories();
 * [
 *   {
 *     id: 1,
 *     title: "Роллы",
 *     is_active: true,
 *     slug: "rolls",
 *     image_link: "https://example.com/images/rolls.jpg",
 *     sort_number: 1
 *   },
 *   ...,
 * ]
 */
export const getAllActiveCategories = async (): Promise<ActionResult<Category[]>> => {
  try {
    const response = await pool.query(`
      SELECT id, title, slug, is_active, image_link, sort_number
      FROM category
      WHERE is_active = true
    `);

    const result = categoryArraySchema.safeParse(response.rows);

    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<Category[]>(result.data);
  } catch (error) {
    console.error('❌ DB error in getAllActiveCategories:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Inserts a new category into the database.
 *
 * ---
 *
 * Вставляет новую категорию в базу данных.
 *
 * @param {Omit<Category, 'id'>} category - Category data without the ID
 * @returns {Promise<ActionResult<Category>>} Result with the inserted category or error
 *
 * @example
 * const result = await insertCategory({
 *   title: 'Роллы',
 *   is_active: true,
 *   slug: 'rolls',
 *   image_link: '/img/rolls.jpg',
 *   sort_number: 1
 * });
 * if (result.success) {
 *   console.log(result.data); // inserted category
 * }
 */
export const insertCategory = async (category: Omit<Category, 'id'>): Promise<ActionResult<Category>> => {
  try {
    const response = await pool.query(
      `INSERT INTO category (title, is_active, slug, image_link, sort_number)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, is_active, slug, image_link, sort_number`,
      [category.title, category.is_active, category.slug, category.image_link, category.sort_number],
    );

    if (response.rowCount !== 1) {
      return errorResult(ErrorCode.DB_ERROR);
    }

    const result = categorySchema.safeParse(response.rows[0]);

    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult(result.data);
  } catch (error) {
    console.error('❌ DB insert error in insertCategory:', error);

    if (error instanceof DatabaseError && error.code === '23505') {
      return errorResult(ErrorCode.CONFLICT);
    }

    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Fetches a single category by its ID.
 *
 * ---
 *
 * Получает категорию по её ID.
 *
 * @param {string} categoryId - The ID of the category
 * @returns {Promise<ActionResult<Category>>} Result with the found category or error
 *
 * @example
 * const result = await getCategoryById('5');
 * if (result.success) {
 *   console.log(result.data); // category object
 * }
 */
export const getCategoryById = async (categoryId: string): Promise<ActionResult<Category>> => {
  try {
    const response = await pool.query(
      `SELECT id, title, is_active, slug, image_link, sort_number
       FROM category
       WHERE id = $1`,
      [categoryId],
    );

    if (response.rowCount === 0) {
      return errorResult(ErrorCode.NOT_FOUND);
    }

    const result = categorySchema.safeParse(response.rows[0]);

    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<Category>(result.data);
  } catch (error) {
    console.error('❌ DB error in getCategoryById:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Updates an existing category by its ID.
 *
 * ---
 *
 * Обновляет существующую категорию по ID.
 *
 * @param {Category} category - Updated category data with ID
 * @returns {Promise<ActionResult<Category>>} Result with the updated category or error
 *
 * @example
 * const result = await updateCategoryById({
 *   id: 5,
 *   title: 'Сеты',
 *   is_active: true,
 *   slug: 'sets',
 *   image_link: '/img/sets.jpg',
 *   sort_number: 3
 * });
 * if (result.success) {
 *   console.log(result.data); // updated category
 * }
 */
export const updateCategoryById = async (category: Category): Promise<ActionResult<Category>> => {
  try {
    const response = await pool.query(
      `UPDATE category
       SET (title, is_active, slug, image_link, sort_number) = ($2, $3, $4, $5, $6)
       WHERE id = $1
       RETURNING id, title, is_active, slug, image_link, sort_number`,
      [category.id, category.title, category.is_active, category.slug, category.image_link, category.sort_number],
    );

    if (response.rowCount === 0) {
      return errorResult(ErrorCode.DB_ERROR);
    }

    const result = categorySchema.safeParse(response.rows[0]);

    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<Category>(result.data);
  } catch (error) {
    console.error('❌ DB error in updateCategoryById:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};
