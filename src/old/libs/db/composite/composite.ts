'use server';
import { pool } from '@/libs/db/db';
import { ActionResult, actionResult, ErrorCode, errorResult } from '@/utils';
import { setItemArraySchema, SetItemType } from '@/types/db/tables/set-item';
import { productIngredientArraySchema, ProductIngredientType } from '@/types/db/tables/product-ingredient';
import { productCategoryArraySchema, ProductCategoryType } from '@/types/db/tables/product-category';

/**
 * Inserts one or multiple products into a set as set items.
 *
 * ---
 *
 * Добавляет один или несколько товаров в состав сета.
 *
 * @param {number} set_id — ID набора (сета), в который добавляются товары
 * @param {number | number[]} product_id — ID товара или массив ID товаров, которые входят в сет
 *
 * @returns {Promise<ActionResult<SetItemType[]>>} Результат запроса: список добавленных записей или ошибка
 *
 * @example
 * await insertSetItems(1, [101, 102]);
 */
export const insertSetItems = async (
  set_id: number,
  product_id: number | number[],
): Promise<ActionResult<SetItemType[]>> => {
  const productIds = Array.isArray(product_id) ? product_id : [product_id];

  if (productIds.length === 0) {
    return actionResult<SetItemType[]>([]);
  }

  try {
    const response = await pool.query(
      `
        INSERT INTO set_item (set_product_id, product_id)
        SELECT $1, unnest($2::int[])
        RETURNING id, set_product_id, product_id, quantity
      `,
      [set_id, productIds],
    );

    const result = setItemArraySchema.safeParse(response.rows);
    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<SetItemType[]>(result.data);
  } catch (error) {
    console.error('❌ DB error in insertSetItems:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Links one or multiple ingredient IDs to a product.
 *
 * ---
 *
 * Добавляет связь между товаром и одним или несколькими ингредиентами.
 *
 * @param {number} product_id — ID товара
 * @param {number | number[]} ingredient_id — ID ингредиента или массив ID ингредиентов
 *
 * @returns {Promise<ActionResult<ProductIngredientType[]>>} Результат запроса: список связей или ошибка
 *
 * @example
 * await insertIngredientsToProduct(5, [11, 12, 13]);
 */

export const insertIngredientsToProduct = async (
  product_id: number,
  ingredient_id: number | number[],
): Promise<ActionResult<ProductIngredientType[]>> => {
  const ingredientIds = Array.isArray(ingredient_id) ? ingredient_id : [ingredient_id];

  if (ingredientIds.length === 0) {
    return actionResult<ProductIngredientType[]>([]);
  }

  try {
    const response = await pool.query(
      `
        INSERT INTO product_ingredient (product_id, ingredient_id)
        SELECT $1, unnest($2::int[])
        RETURNING product_id, ingredient_id
      `,
      [product_id, ingredientIds],
    );

    const result = productIngredientArraySchema.safeParse(response.rows);
    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<ProductIngredientType[]>(result.data);
  } catch (error) {
    console.error('❌ DB error in insertIngredientsToProduct:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Links one or multiple category IDs to a product.
 *
 * ---
 *
 * Добавляет связь между товаром и одной или несколькими категориями.
 *
 * @param {number} product_id — ID товара
 * @param {number | number[]} category_id — ID категории или массив ID категорий
 *
 * @returns {Promise<ActionResult<ProductCategoryType[]>>} Результат запроса: список связей или ошибка
 *
 * @example
 * await insertCategoriesToProduct(8, [2, 3]);
 */

export const insertCategoriesToProduct = async (
  product_id: number,
  category_id: number | number[],
): Promise<ActionResult<ProductCategoryType[]>> => {
  const categoryIds = Array.isArray(category_id) ? category_id : [category_id];

  if (categoryIds.length === 0) {
    return actionResult<ProductCategoryType[]>([]);
  }

  try {
    const response = await pool.query(
      `
        INSERT INTO product_category (product_id, category_id)
        SELECT $1, unnest($2::int[])
        RETURNING product_id, category_id
      `,
      [product_id, categoryIds],
    );

    const result = productCategoryArraySchema.safeParse(response.rows);
    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<ProductCategoryType[]>(result.data);
  } catch (error) {
    console.error('❌ DB error in insertIngredientsToProduct:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};
