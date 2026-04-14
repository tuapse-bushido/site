import { getProductCards } from '../repository/product.repository';
import { getAllActiveCategories } from '../repository/category.repository';
import { ActionResult } from 'shared/types/action.types';
import { ProductCard } from 'modules/client/catalog/entities/product-card.entity';
import { Category } from 'shared/entites/category';
import { cacheLife, cacheTag } from 'next/cache';

export type CatalogGroupedItem = {
  category: Category;
  products: ProductCard[];
};

export const getCatalog = async (): Promise<ActionResult<CatalogGroupedItem[]>> => {
  'use cache';
  cacheLife('admin');
  cacheTag('catalog');

  const [productsRes, categoriesRes] = await Promise.all([getProductCards(), getAllActiveCategories()]);

  if (!productsRes.ok) return productsRes;
  if (!categoriesRes.ok) return categoriesRes;

  const categoryMap = new Map<number, ProductCard[]>();

  for (const product of productsRes.data) {
    for (const categoryId of product.category_ids) {
      const list = categoryMap.get(categoryId);
      if (list) {
        list.push(product);
      } else {
        categoryMap.set(categoryId, [product]);
      }
    }
  }

  const grouped = categoriesRes.data
    .filter((category): boolean => categoryMap.has(category.id))
    .map(
      (category): CatalogGroupedItem => ({
        category,
        products: categoryMap.get(category.id)!,
      }),
    );

  return {
    ok: true,
    data: grouped,
  };
};
