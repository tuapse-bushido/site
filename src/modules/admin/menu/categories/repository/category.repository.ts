'use server';

import { cacheLife, cacheTag } from 'next/cache';
import { ActionResult } from 'shared/types/action.types';
import { dbExecute, dbQuery } from 'shared/utils/db.utils';
import { Category, categoryArraySchema } from 'modules/admin/menu/categories';

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
  'use cache';
  cacheLife('admin');
  cacheTag(`categories`);

  const query = `
    SELECT id, title, is_active, slug, image_link, sort_number
    FROM category
    ORDER BY id;
  `;

  return dbQuery(query, [], categoryArraySchema, 'multiple');
};

/**
 * Fetches a single category by its ID.
 *
 * ---
 *
 * Получает категорию по её ID.
 *
 * @param {string} id - The ID of the category
 * @returns {Promise<ActionResult<Category>>} Result with the found category or error
 *
 * @example
 * const result = await getCategoryById('5');
 * if (result.success) {
 *   console.log(result.data); // category object
 * }
 */
export const getCategoryById = async (id: number): Promise<ActionResult<Category>> => {
  'use cache';
  cacheLife('admin');
  cacheTag(`category-${id}`);

  const query = `
    SELECT id, title, is_active, slug, image_link, sort_number
    FROM category
    WHERE id = $1;
  `;
  const params = [id];

  return dbExecute(query, params);
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
  const query = `
    INSERT INTO category (title, is_active, slug, image_link, sort_number)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, title, is_active, slug, image_link, sort_number;`;
  const params = [category.title, category.is_active, category.slug, category.image_link, category.sort_number];

  return dbExecute(query, params);
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

  return dbExecute(query, params);
};
