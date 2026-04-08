import { JSX } from 'react';
import styles from './category-section.module.scss';
import { CategorySectionProps } from './category-section.props';
import { ProductCardView } from 'modules/client/catalog/entities/ui/product-card/product-card-view/product-card-view';

export const CategorySection = ({ category, products }: CategorySectionProps): JSX.Element => {
  return (
    <section className={styles.section}>
      <h2 className={styles.title}>{category.title}</h2>

      <div className={styles.productList}>
        {products.map(
          (product): JSX.Element => (
            <ProductCardView key={product.id} product={product} />
          ),
        )}
      </div>
    </section>
  );
};
