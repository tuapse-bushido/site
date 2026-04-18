import { Category } from 'modules/admin/menu/categories';
import { Ingredient } from 'modules/admin/menu/ingredients/entities';
import { Product, ProductWithDetails } from 'modules/admin/menu/products/entities';

export type ProductEditData = {
  product?: ProductWithDetails;
  ingredients: Ingredient[];
  categories: Category[];
  products: Product[];
};
