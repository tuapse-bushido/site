import { getIngredientById, IngredientForm } from 'modules/admin/menu/ingredients';
import { CategoryForm, getCategoryById } from 'modules/admin/menu/categories';
import { getProductEditData } from 'modules/admin/menu/products/use-cases';
import { ProductForm } from 'modules/admin/menu/products/features/products-form/ui/product-form';

export const formShellRegistry = {
  ingredient: {
    fetch: getIngredientById,
    propName: 'ingredient' as const,
    Component: IngredientForm,
  },
  category: {
    fetch: getCategoryById,
    propName: 'category' as const,
    Component: CategoryForm,
  },
  product: {
    fetch: getProductEditData,
    propName: 'productData' as const,
    Component: ProductForm,
  },
} as const;

export type FormShellToken = keyof typeof formShellRegistry;
