import clsx from 'clsx';
import { JSX } from 'react';
import styles from './category-section.module.scss';
import { ProductCard } from '@/components/product/product-card/product-card';
import { CategorySectionProps } from '@/components/category/category-section/category-section.props';

export const CategorySection = ({ category, products, ...props }: CategorySectionProps): JSX.Element => {
  return (
    <section {...props}>
      <h1>{category.title}</h1>

      <div className={clsx(styles.productList)}>
        {products.map(
          (product): JSX.Element => (
            <ProductCard key={product.id} variant={'main'} product={product} />
          ),
        )}
      </div>
    </section>
  );
};
