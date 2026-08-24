import { JSX, Suspense } from 'react';
import { PageContainer } from 'modules/admin/shared/ui/page-container';
import { FormShell } from 'modules/admin/shared/ui/form-shell/form-shell';

type Props = {
  params: Promise<{ id: string }>;
};

export const UpdateIngredientScreen = ({ params }: Props): JSX.Element => {
  return (
    <PageContainer title={'Редактирование ингредиента'}>
      <Suspense fallback="loading your inbox...">
        <FormShell
          params={params}
          token="ingredient"
          cacheProfile={'admin'}
          tagConfig={{ base: 'admin-pages', prefix: 'ingredient-page-' }}
        />
      </Suspense>
    </PageContainer>
  );
};
