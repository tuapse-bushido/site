import { JSX } from 'react';
import { Product } from '@/types/db/product';
import { getAllActiveProducts } from '@/libs/db/product/get-all-active-products';
import { getAllActiveCategories } from '@/libs/db/category/get-all-active-categories';
import { CategorySection } from '@/components/category/category-section/category-section';
import { Grouped, GroupedItem } from '@/types';

const HomePage = async (): Promise<JSX.Element> => {
  const products = await getAllActiveProducts();
  const categories = await getAllActiveCategories();

  const grouped = categories.reduce<Grouped>((acc, category): Grouped => {
    const isActiveProducts: Product[] = products.filter(
      (product: Product): boolean => product.category_id === category.id,
    );

    const item: GroupedItem = {
      category,
      products: isActiveProducts,
    };

    acc.push(item);

    return acc;
  }, []);

  return (
    <>
      {grouped.map(
        (item): JSX.Element => (
          <CategorySection
            key={item.category.id}
            category={item.category}
            products={item.products}
          />
        ),
      )}
    </>
  );
};

export default HomePage;
