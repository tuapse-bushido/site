import { JSX } from 'react';
import { CategoryForm } from 'modules/admin/menu/categories/widgets';
import { PageContainer } from 'modules/admin/shared/ui/page-container';

export const CreateCategoryScreen = (): JSX.Element => {
  return (
    <PageContainer title={'Новая категория'}>
      <CategoryForm />
    </PageContainer>
  );
};
