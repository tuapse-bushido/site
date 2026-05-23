import { CategoryForm } from 'modules/admin/menu/categories/widgets';
import { IngredientForm } from 'modules/admin/menu/ingredients/widgets';
import { ProductForm } from 'modules/admin/menu/products/features/product-form/';
import { AddonRuleForm } from 'modules/admin/rules/features/addon-rule-form/ui';

import { getAddonRuleEditData } from 'modules/admin/rules/use-cases';
import { getProductEditData } from 'modules/admin/menu/products/use-cases';
import { ingredientRepo } from 'modules/admin/menu/ingredients/repository';
import { categoryRepo } from 'modules/admin/menu/categories/repository';

export const formShellRegistry = {
  ingredient: {
    fetch: ingredientRepo.getIngredientById,
    propName: 'ingredient' as const,
    Component: IngredientForm,
  },
  category: {
    fetch: categoryRepo.getCategoryById,
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
