import { CategoryForm } from 'modules/admin/menu/categories/widgets';
import { IngredientForm } from 'modules/admin/menu/ingredients/widgets';
import { ProductForm } from 'modules/admin/menu/products/widgets/product-form';
import { AddonRuleForm } from 'modules/admin/rules/widgets/addon-rule-form';

import { addonRuleCases } from 'modules/admin/rules/use-cases';
import { productCases } from 'modules/admin/menu/products/use-cases';
import { categoryRepo } from 'modules/admin/menu/categories/repository';
import { ingredientRepo } from 'modules/admin/menu/ingredients/repository';

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
    fetch: productCases.getProductEditData,
    propName: 'productData' as const,
    Component: ProductForm,
  },
  rule: {
    fetch: addonRuleCases.getAddonRuleEditData,
    propName: 'addonRuleData' as const,
    Component: AddonRuleForm,
  },
} as const;

export type FormShellToken = keyof typeof formShellRegistry;
