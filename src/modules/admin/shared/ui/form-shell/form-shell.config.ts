import { CategoryForm, getCategoryById } from 'modules/admin/menu/categories';
import { ProductForm } from 'modules/admin/menu/products/features/product-form/';
import { AddonRuleForm } from 'modules/admin/rules/features/addon-rule-form/ui';

import { getAddonRuleEditData } from 'modules/admin/rules/use-cases';
import { getProductEditData } from 'modules/admin/menu/products/use-cases';
import { getIngredientById, IngredientForm } from 'modules/admin/menu/ingredients';

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
  rule: {
    fetch: getAddonRuleEditData,
    propName: 'ruleData' as const,
    Component: AddonRuleForm,
  },
} as const;

export type FormShellToken = keyof typeof formShellRegistry;
