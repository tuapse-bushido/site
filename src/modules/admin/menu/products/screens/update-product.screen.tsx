import { JSX, Suspense } from 'react';
import { PageContainer } from 'modules/admin/shared/ui/page-container';
import { FormShell } from 'modules/admin/shared/ui/form-shell/form-shell';

type Props = {
  params: Promise<{ id: string }>;
};

export const UpdateProductScreen = ({ params }: Props): JSX.Element => {
  return (
    <PageContainer title={'Редактирование продукта'}>
      <Suspense fallback="loading your inbox...">
        <FormShell
          params={params}
          token="product"
          cacheProfile={'admin'}
          tagConfig={{ base: 'admin-pages', prefix: 'product-page-' }}
        />
      </Suspense>
    </PageContainer>
  );
};
