import { dbQuery } from 'shared/utils/db.utils';
import { ActionResult } from 'shared/types/action.types';
import { Category, categoryArraySchema } from 'shared/entites/category';
import { cacheLife, cacheTag } from 'next/cache';

export const getAllActiveCategories = async (): Promise<ActionResult<Category[]>> => {
  'use cache';
  cacheLife('admin');
  cacheTag('categories', `categories-active`);

  const query = `
      SELECT id, title, slug, is_active, image_link, sort_number
      FROM category
      WHERE is_active = true;
`;

  return dbQuery(query, [], categoryArraySchema, 'multiple');
};
