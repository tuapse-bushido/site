import { JSX } from 'react';
import styles from './category-section.module.scss';
import { CategorySectionProps } from './category-section.props';
import { ProductCard } from 'modules/client/catalog/entities/ui/product-card';

export const CategorySection = ({ category, products }: CategorySectionProps): JSX.Element => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{category.title}</h2>

      <div className={styles.productList}>
        {products.map(
          (product): JSX.Element => (
            <ProductCard key={product.id} variant={'main'} product={product} />
          ),
        )}
      </div>
    </section>
  );
};
