import { JSX } from 'react';
import { CategoryForm } from '@/components/forms/category/category-form';
import { UpdateCategoryProps } from '@/views/admins/categories/update-category/update-category.props';
import { getCategoryById } from '@/libs/db/category/category.query';
import { actionUpdateCategory } from '@/utils/actions/category.action';

export const UpdateCategoryPage = async ({ params }: UpdateCategoryProps): Promise<JSX.Element | null> => {
  const { id } = await params;
  const category = await getCategoryById(id);

  if (!category.success) return null;

  return (
    <div>
      <CategoryForm action={actionUpdateCategory} category={category.data} />
    </div>
  );
};
