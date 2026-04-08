import { ProductWithDetails, productWithDetailSchema } from 'modules/admin/menu/products/entities';
import { ActionResult } from 'shared/types/action.types';
import { cacheLife, cacheTag } from 'next/cache';
import { dbQuery } from 'shared/utils/db.utils';
import { getAllIngredients } from 'modules/admin/menu/ingredients';
import { getAllCategories } from 'modules/admin/menu/categories';
import { actionError, actionSuccess, unwrap } from 'modules/admin/shared/utils/action.utils';
import { ProductEditData } from './product.cases.types';
import { getAllProducts } from 'modules/admin/menu/products/repository';
import { ErrorCode } from 'shared/types/error-codes.types';

/**
 * Fetches a product along with its ingredients, categories, and set items.
 *
 * ---
 * Получает товар по ID, включая ингредиенты, категории и состав сета.
 *
 * @param {number} id - ID товара
 * @returns {Promise<ActionResult<ProductWithDetails>>} Подробная информация о товаре или ошибка.
 *
 * @example
 * const result = await getProductWithDetails(42);
 */
export const getProductWithDetails = async (id: number): Promise<ActionResult<ProductWithDetails>> => {
  'use cache';
  cacheLife('admin');
  cacheTag(`product-details-${id}`);

  const query = `
    WITH set_items_cte AS (SELECT si.set_product_id AS product_id,
                                  jsonb_agg(jsonb_build_object
                                            ('id', sp.id,
                                             'title', sp.title)
                                  )                 AS set_items
                           FROM set_item si
                                  JOIN product sp ON sp.id = si.product_id
                           GROUP BY si.set_product_id),

         ingredients_cte AS (SELECT pi.product_id,
                                    jsonb_agg(
                                      jsonb_build_object(
                                        'id', i.id,
                                        'title', i.title
                                      )
                                    ) AS ingredients
                             FROM product_ingredient pi
                                    JOIN ingredient i ON i.id = pi.ingredient_id
                             GROUP BY pi.product_id),

         categories_cte AS (SELECT pc.product_id,
                                   jsonb_agg(
                                     jsonb_build_object(
                                       'id', c.id,
                                       'title', c.title
                                     )
                                   ) AS categories
                            FROM product_category pc
                                   JOIN category c ON c.id = pc.category_id
                            GROUP BY pc.product_id)

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

           COALESCE(si.set_items, '[]'::jsonb)  AS set_items,
           COALESCE(i.ingredients, '[]'::jsonb) AS ingredients,
           COALESCE(c.categories, '[]'::jsonb)  AS categories

    FROM product p
           LEFT JOIN set_items_cte si ON si.product_id = p.id
           LEFT JOIN ingredients_cte i ON i.product_id = p.id
           LEFT JOIN categories_cte c ON c.product_id = p.id

    WHERE p.id = $1;
  `;

  return dbQuery(query, [id], productWithDetailSchema);
};

export const getProductEditData = async (id?: number): Promise<ActionResult<ProductEditData>> => {
  try {
    const [ingredients, categories, products] = await Promise.all([
      getAllIngredients().then(unwrap),
      getAllCategories().then(unwrap),
      getAllProducts().then(unwrap),
    ]);

    if (!id) {
      return actionSuccess({
        ingredients,
        categories,
        products,
      });
    }

    const product = await getProductWithDetails(id).then(unwrap);

    const filteredProducts = products.filter((p): boolean => p.id !== product.id);

    return actionSuccess({
      product,
      ingredients,
      categories,
      products: filteredProducts,
    });
  } catch {
    return actionError(ErrorCode.DB_ERROR);
  }
};
