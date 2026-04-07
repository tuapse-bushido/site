import { Category } from 'shared/entites/category';
import { ProductCard } from 'modules/client/catalog/entities/product-card.entity';

export type CategorySectionProps = {
  category: Category;
  products: ProductCard[];
};
