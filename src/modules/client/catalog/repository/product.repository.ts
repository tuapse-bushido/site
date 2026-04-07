import { cacheLife, cacheTag } from 'next/cache';
import { ActionResult } from 'shared/types/action.types';
import { arrayProductCardSchema, ProductCard } from 'modules/client/catalog/entities/product-card.entity';
import { dbQuery } from 'shared/utils/db.utils';

export const getProductCards = async (): Promise<ActionResult<ProductCard[]>> => {
  'use cache';
  cacheLife('admin');
  cacheTag(`product-cards`);

  const query = `
      SELECT id,
             title,
             slug,
             image_link,
             price,
             weight,
             count_portion,
             quantity,
             is_set,
             is_visible,
             is_active,
             ingredients,
             category_ids,
             discount_percent,
             addons,
             set_items
      FROM product_card_view;
    `;

  return dbQuery(query, [], arrayProductCardSchema, 'multiple');
};
