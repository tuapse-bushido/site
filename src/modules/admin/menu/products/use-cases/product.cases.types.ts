import { Product, ProductWithDetails } from 'modules/admin/menu/products/entities';
import { Ingredient } from 'modules/admin/menu/ingredients';

export type ProductEditData = {
  product?: ProductWithDetails;
  ingredients: Ingredient[];
  categories: Ingredient[];
  products: Product[];
};
