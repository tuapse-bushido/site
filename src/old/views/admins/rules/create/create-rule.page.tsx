import { JSX } from 'react';
import { AdminPageHeader } from '@/components/admin/admin-page-header/admin-page.header';
import { getAllProducts } from '@/libs/db/product/products.query';
import { getAllCategories } from '@/libs/db/category/category.query';
import { Category, Product } from '@/types';
import { RuleForm } from '@/components/forms/rule/rule.form';
import { actionInsertRule } from '@/utils/actions/addons.action';

export const CreateRulePage = async (): Promise<JSX.Element> => {
  const { products, categories } = await (async (): Promise<{ products: Product[]; categories: Category[] }> => {
    const dataProducts = await getAllProducts();
    const dataCategories = await getAllCategories();

    const products = dataProducts.success ? dataProducts.data : [];
    const categories = dataCategories.success ? dataCategories.data : [];

    return { products, categories };
  })();

  return (
    <div>
      <AdminPageHeader title={'Создать новое правило'} />

      <RuleForm categories={categories} products={products} action={actionInsertRule} />
    </div>
  );
};
