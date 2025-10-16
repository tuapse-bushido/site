'use server';
import { pool } from '@/libs/db/db';
import { actionResult, ActionResult, ErrorCode, errorResult } from '@/utils';
import { Product, productArraySchema, productSchema, ProductWithDetails, productWithDetailsSchema } from '@/types';

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
  try {
    const response = await pool.query(
      `SELECT id,
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
      `,
    );

    const result = productArraySchema.safeParse(response.rows);
    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<Product[]>(result.data);
  } catch (error) {
    console.error('❌ DB error in getAllProducts:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Fetches a product along with its ingredients, categories, and set items.
 *
 * ---
 * Получает товар по ID, включая ингредиенты, категории и состав сета.
 *
 * @param {number} product_id - ID товара
 * @returns {Promise<ActionResult<ProductWithDetails>>} Подробная информация о товаре или ошибка.
 *
 * @example
 * const result = await getProductWithDetails(42);
 */
export const getProductWithDetails = async (product_id: number): Promise<ActionResult<ProductWithDetails>> => {
  const query = `
    SELECT p.id,
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
           COALESCE(
             (SELECT array_agg(
                       json_build_object('id', sp.id, 'title', sp.title)
                     )
              FROM set_item si
                     JOIN product sp ON sp.id = si.product_id
              WHERE si.set_product_id = p.id),
             ARRAY []::json[]
           ) AS set_items,
           COALESCE(
             (SELECT array_agg(
                       json_build_object('id', i.id, 'title', i.title)
                     )
              FROM product_ingredient pi
                     JOIN ingredient i ON i.id = pi.ingredient_id
              WHERE pi.product_id = p.id),
             ARRAY []::json[]
           ) AS ingredients,
           COALESCE(
             (SELECT array_agg(
                       json_build_object('id', c.id, 'title', c.title)
                     )
              FROM product_category pc
                     JOIN category c ON c.id = pc.category_id
              WHERE pc.product_id = p.id),
             ARRAY []::json[]
           ) AS categories
    FROM product p
    WHERE p.id = $1
  `;

  try {
    const response = await pool.query(query, [product_id]);

    if (!response.rows.length) {
      return errorResult(ErrorCode.NOT_FOUND);
    }

    const result = productWithDetailsSchema.safeParse(response.rows[0]);
    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<ProductWithDetails>(result.data);
  } catch (error) {
    console.error('❌ DB error in getProductWithDetails:', error);
    return errorResult(ErrorCode.DB_ERROR);
  }
};

/**
 * Inserts a new product into the database.
 *
 * ---
 * Добавляет новый товар в базу данных.
 *
 * @param {Omit<Product, 'id'>} product - Объект товара без ID
 * @returns {Promise<ActionResult<Product>>} Созданный товар или ошибка.
 *
 * @example
 * const newProduct = { title: 'Ролл', is_set: false, ... };
 * const result = await insertProduct(newProduct);
 */
export const insertProduct = async (product: Omit<Product, 'id'>): Promise<ActionResult<Product>> => {
  const { title, is_set, is_active, weight, slug, image_link, price, quantity, count_portion, is_visible } = product;

  try {
    const response = await pool.query(
      `INSERT into product (title, is_active, is_visible, slug, image_link, price, weight, count_portion, quantity,
                            is_set)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *
      `,
      [title, is_active, is_visible, slug, image_link, price, weight, count_portion, quantity, is_set],
    );

    const result = productSchema.safeParse(response.rows[0]);
    if (!result.success) {
      return errorResult(ErrorCode.VALIDATION_FAILED);
    }

    return actionResult<Product>(result.data);
  } catch (error) {
    console.error('❌ DB error in insertProduct:', error);

    return errorResult(ErrorCode.DB_ERROR);
  }
};
