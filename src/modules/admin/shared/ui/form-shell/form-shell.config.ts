import { getIngredientById, IngredientForm } from '@/src/modules/admin/menu/ingredients';

export const formShellRegistry = {
  ingredient: {
    fetch: getIngredientById,
    propName: 'ingredient' as const,
    Component: IngredientForm,
  },
} as const;

export type FormShellToken = keyof typeof formShellRegistry;
