import { JSX } from 'react';
import { CategoryForm } from '@/components/forms/category/category-form';
import { actionInsertCategory } from '@/utils/actions/category.action';

export const CreateCategoryPage = (): JSX.Element => {
  return <CategoryForm action={actionInsertCategory} />;
};
