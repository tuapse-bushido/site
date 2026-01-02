import { getIngredientById, IngredientForm } from '@/src/modules/admin/menu/ingredients';
import { CategoryForm, getCategoryById } from 'modules/admin/menu/categories';

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
} as const;

export type FormShellToken = keyof typeof formShellRegistry;
