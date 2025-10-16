import { JSX } from 'react';
import { CategorySection } from '@/components/category/category-section/category-section';
import { Grouped, GroupedItem } from '@/types';
import { getProductCards } from '@/libs/db/product/get-product-cards';
import { ProductCard } from '@/types/db/composite/product-card';
import { getAllActiveCategories } from '@/libs/db/category/category.query';

export const HomePage = async (): Promise<JSX.Element | null> => {
  const products = await getProductCards();
  const categories = await getAllActiveCategories();

  if (!categories.success) return null;

  const categoryMap = new Map<number, ProductCard[]>();
  for (const product of products) {
    for (const categoryId of product.category_ids) {
      if (!categoryMap.has(categoryId)) {
        categoryMap.set(categoryId, []);
      }

      categoryMap.get(categoryId)!.push(product);
    }
  }
  const grouped: Grouped = categories.data
    .filter((category): boolean => categoryMap.has(category.id))
    .map(
      (category): GroupedItem => ({
        category,
        products: categoryMap.get(category.id)!,
      }),
    );

  return (
    <>
      {grouped.map(
        (item): JSX.Element => (
          <CategorySection key={item.category.id} category={item.category} products={item.products} />
        ),
      )}
    </>
  );
};
