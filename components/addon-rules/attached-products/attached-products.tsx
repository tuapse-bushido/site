import { JSX } from 'react';
import { Divider } from '@/components/cart/divider/divider';
import { AttachedCategory, AttachedProduct } from '@/types';

export const AttachedProducts = ({
  products,
  categories,
}: {
  products: AttachedProduct[];
  categories: AttachedCategory[];
}): JSX.Element => {
  return (
    <div>
      <h2>Применяется к:</h2>
      <Divider direction={'horizontal'} />

      {categories.length > 0 && (
        <>
          <h3>Категории</h3>
          <div>
            {categories.map(
              (category): JSX.Element => (
                <span key={category.category_id}>{category.category_title}</span>
              ),
            )}
          </div>
        </>
      )}
      {products.length > 0 && (
        <>
          <h3>Продукты</h3>
          <div>
            {products.map(
              (category): JSX.Element => (
                <span key={category.product_id}>{category.product_title}</span>
              ),
            )}
          </div>
        </>
      )}
    </div>
  );
};
