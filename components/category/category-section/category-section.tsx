import { JSX } from 'react';
import { CategorySectionProps } from '@/components/category/category-section/category-section.props';
import { ProductCardMain } from '@/components/product/product-card/product-card-main/product-card-main';
import clsx from 'clsx';
import styles from './category-section.module.scss';

export const CategorySection = ({
  category,
  products,
  ...props
}: CategorySectionProps): JSX.Element => {
  return (
    <section {...props}>
      <h1>{category.title}</h1>

      <div className={clsx(styles.productList)}>
        {products.map(
          (product): JSX.Element => (
            <ProductCardMain key={product.id} product={product} type={'main'} />
          ),
        )}
      </div>
    </section>
  );
};
