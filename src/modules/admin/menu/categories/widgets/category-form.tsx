import { JSX } from 'react';
import { Category } from 'modules/admin/menu/categories/entities';
import { FormResetContainer } from 'modules/admin/shared/ui/form-reset-container';
import { CategoryFormContent } from 'modules/admin/menu/categories/features/category-form-content';

type Props = {
  category?: Category;
};

export const CategoryForm = ({ category }: Props): JSX.Element => {
  return (
    <FormResetContainer>
      <CategoryFormContent category={category} />
    </FormResetContainer>
  );
};
