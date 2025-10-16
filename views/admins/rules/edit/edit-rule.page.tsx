import { JSX } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header/admin-page.header';
import { getAllProducts } from '@/libs/db/product/products.query';
import { getAllCategories } from '@/libs/db/category/category.query';
import { Category, Product } from '@/types';
import { RuleForm } from '@/components/forms/rule/rule.form';
import { getAddonRuleFullById } from '@/libs/db/addons/addons.query';
import { actionUpdateRule } from '@/utils/actions/addons.action';

export const EditRulePage = async ({
  params,
}: {
  params: Promise<{ rule_id: string }>;
}): Promise<JSX.Element | null> => {
  const { products, categories } = await (async (): Promise<{ products: Product[]; categories: Category[] }> => {
    const dataProducts = await getAllProducts();
    const dataCategories = await getAllCategories();

    const products = dataProducts.success ? dataProducts.data : [];
    const categories = dataCategories.success ? dataCategories.data : [];

    return { products, categories };
  })();

  const rule_id = Number((await params).rule_id);
  const rule = await getAddonRuleFullById(rule_id);

  if (!rule.success) return null;

  return (
    <div>
      <AdminPageHeader title={'Создать новое правило'} />

      <RuleForm rule={rule.data} categories={categories} products={products} action={actionUpdateRule} />
    </div>
  );
};
